import {
    HttpResponse,
    http as mockHttp,
} from 'msw'
import { describe, expect, it } from 'vitest'
import {
    obtenerArtistaPorId,
    obtenerArtistaPorNombre,
    obtenerArtistasActivos,
} from '../../../funcionalidades/artistas/api'
import { artistasQueries } from '../../../funcionalidades/artistas/hooks'
import { server } from '../../mocks/server'

const artista = {
    id: 1,
    stageName: 'Solar Beat',
    country: null,
    genre: null,
    active: true,
}

describe('API de artistas', () => {
    it('consulta artistas activos', async () => {
        server.use(
            mockHttp.get(
                '/api/artists/active',
                () =>
                    HttpResponse.json([artista]),
            ),
        )

        const resultado =
            await obtenerArtistasActivos()

        expect(resultado).toHaveLength(1)
    })

    it('consulta artista por ID', async () => {
        server.use(
            mockHttp.get(
                '/api/artists/1',
                () =>
                    HttpResponse.json(artista),
            ),
        )

        const resultado =
            await obtenerArtistaPorId(1)

        expect(resultado.stageName).toBe(
            'Solar Beat',
        )
    })

    it('consulta artista por stageName correctamente codificado', async () => {
        server.use(
            mockHttp.get(
                '/api/artists/by-stage-name',
                ({ request }) => {
                    const url = new URL(request.url)

                    expect(
                        url.searchParams.get('stageName'),
                    ).toBe('Solar Beat')

                    return HttpResponse.json(artista)
                },
            ),
        )

        const resultado =
            await obtenerArtistaPorNombre(
                'Solar Beat',
            )

        expect(resultado.id).toBe(1)
    })

    it('mantiene caché de catálogo durante cinco minutos', () => {
        expect(
            artistasQueries.activos().staleTime,
        ).toBe(5 * 60_000)

        expect(
            artistasQueries.detalle(1).queryKey,
        ).toEqual(['artista', 1])

        expect(
            artistasQueries.detalle(1).staleTime,
        ).toBe(5 * 60_000)
    })
})