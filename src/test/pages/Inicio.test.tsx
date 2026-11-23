import { screen } from '@testing-library/react'
import {
    HttpResponse,
    http as mockHttp,
} from 'msw'
import {
    describe,
    expect,
    it,
} from 'vitest'
import Inicio from '../../pages/Inicio'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const eventos = Array.from(
    { length: 4 },
    (_, indice) => ({
        id: indice + 1,
        eventCode: `EVT-00${indice + 1}`,
        name: `Evento ${indice + 1}`,
        category: 'MUSIC',
        status: 'PUBLISHED',
        eventDate:
            '2026-12-20T20:00:00',
        venueCode: 'VEN-001',
        venueName: 'Arena Pulse',
    }),
)

const artistas = Array.from(
    { length: 7 },
    (_, indice) => ({
        id: indice + 1,
        stageName: `Artista ${indice + 1}`,
        country: 'Colombia',
        genre: 'Music',
        active: true,
    }),
)

function configurarInicio(
    eventosRespuesta = eventos,
    artistasRespuesta = artistas,
) {
    server.use(
        mockHttp.get(
            '/api/events/published',
            () =>
                HttpResponse.json(
                    eventosRespuesta,
                ),
        ),
        mockHttp.get(
            '/api/artists/active',
            () =>
                HttpResponse.json(
                    artistasRespuesta,
                ),
        ),
    )
}

describe('Inicio', () => {
    it('muestra solo tres eventos y seis artistas destacados', async () => {
        configurarInicio()

        renderConRouter(<Inicio />)

        expect(
            await screen.findByRole(
                'heading',
                {
                    name: 'Evento 1',
                },
            ),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('heading', {
                name: 'Evento 3',
            }),
        ).toBeInTheDocument()

        expect(
            screen.queryByRole('heading', {
                name: 'Evento 4',
            }),
        ).not.toBeInTheDocument()

        expect(
            screen.getByText('Artista 1'),
        ).toBeInTheDocument()

        expect(
            screen.getByText('Artista 6'),
        ).toBeInTheDocument()

        expect(
            screen.queryByText('Artista 7'),
        ).not.toBeInTheDocument()
    })

    it('muestra estados vacíos cuando no hay contenido público', async () => {
        configurarInicio([], [])

        renderConRouter(<Inicio />)

        expect(
            await screen.findByRole(
                'heading',
                {
                    name: 'Aún no hay eventos publicados',
                },
            ),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('heading', {
                name: 'Aún no hay artistas disponibles',
            }),
        ).toBeInTheDocument()
    })

    it('muestra un estado de error cuando falla la carga', async () => {
        server.use(
            mockHttp.get(
                '/api/events/published',
                () =>
                    HttpResponse.json(
                        {
                            timestamp:
                                '2026-11-18T17:00:00',
                            status: 500,
                            error:
                                'Internal Server Error',
                            message:
                                'Unexpected error',
                            details: {},
                        },
                        {
                            status: 500,
                        },
                    ),
            ),
            mockHttp.get(
                '/api/artists/active',
                () =>
                    HttpResponse.json(
                        artistas,
                    ),
            ),
        )

        renderConRouter(<Inicio />)

        expect(
            await screen.findByRole(
                'alert',
            ),
        ).toHaveTextContent(
            'No pudimos cargar el contenido de inicio.',
        )

        expect(
            screen.getByRole('button', {
                name: 'Reintentar',
            }),
        ).toBeInTheDocument()
    })
})