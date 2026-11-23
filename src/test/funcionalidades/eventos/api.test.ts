import {
    HttpResponse,
    http as mockHttp,
} from 'msw'
import { describe, expect, it } from 'vitest'
import {
    obtenerEventoPorCodigo,
    obtenerEventosPorArtista,
    obtenerEventosPublicados,
} from '../../../funcionalidades/eventos/api'
import { eventosQueries } from '../../../funcionalidades/eventos/hooks'
import { server } from '../../mocks/server'

const eventoResumen = {
    id: 1,
    eventCode: 'CMF-2026',
    name: 'Caribbean Music Fest 2026',
    category: 'MUSIC',
    status: 'PUBLISHED',
    eventDate:
        '2026-12-12T20:00:00',
    venueCode: 'VEN-SMR-01',
    venueName:
        'Marina Convention Center',
}

describe('API de eventos', () => {
    it('consulta los eventos publicados', async () => {
        server.use(
            mockHttp.get(
                '/api/events/published',
                () =>
                    HttpResponse.json([
                        eventoResumen,
                    ]),
            ),
        )

        const resultado =
            await obtenerEventosPublicados()

        expect(resultado).toHaveLength(1)

        expect(
            resultado[0]?.eventCode,
        ).toBe('CMF-2026')
    })

    it('consulta el detalle por eventCode', async () => {
        server.use(
            mockHttp.get(
                '/api/events/CMF-2026',
                () =>
                    HttpResponse.json({
                        ...eventoResumen,
                        description:
                            'Festival de música.',
                        minimumAge: 18,
                        streamingUrl: null,
                        artists: [],
                    }),
            ),
        )

        const resultado =
            await obtenerEventoPorCodigo(
                'CMF-2026',
            )

        expect(resultado.name).toBe(
            'Caribbean Music Fest 2026',
        )
    })

    it('codifica stageName al buscar eventos por artista', async () => {
        server.use(
            mockHttp.get(
                '/api/events/by-artist',
                ({ request }) => {
                    const url = new URL(
                        request.url,
                    )

                    expect(
                        url.searchParams.get(
                            'stageName',
                        ),
                    ).toBe('Solar Beat')

                    return HttpResponse.json([
                        eventoResumen,
                    ])
                },
            ),
        )

        const resultado =
            await obtenerEventosPorArtista(
                'Solar Beat',
            )

        expect(resultado).toHaveLength(1)
    })

    it('rechaza una respuesta exitosa que incumple el contrato', async () => {
        server.use(
            mockHttp.get(
                '/api/events/published',
                () =>
                    HttpResponse.json([
                        {
                            id: 1,
                            eventCode: 'CMF-2026',
                        },
                    ]),
            ),
        )

        await expect(
            obtenerEventosPublicados(),
        ).rejects.toMatchObject({
            name: 'ApiError',
            tipo: 'respuesta-invalida',
        })
    })

    it('configura query keys y staleTime del catálogo', () => {
        expect(
            eventosQueries.publicados()
                .queryKey,
        ).toEqual([
            'eventos',
            'publicados',
        ])

        expect(
            eventosQueries.publicados()
                .staleTime,
        ).toBe(60_000)

        expect(
            eventosQueries.detalle(
                'CMF-2026',
            ).staleTime,
        ).toBe(30_000)

        expect(
            eventosQueries.artista(
                'Solar Beat',
            ).staleTime,
        ).toBe(60_000)
    })
})