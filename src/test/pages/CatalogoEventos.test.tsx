import {
    screen,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
    HttpResponse,
    http as mockHttp,
} from 'msw'
import {
    describe,
    expect,
    it,
} from 'vitest'
import CatalogoEventos from '../../pages/CatalogoEventos'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const eventos = [
    {
        id: 1,
        eventCode: 'CMF-2026',
        name: 'Caribbean Music Fest',
        category: 'MUSIC',
        status: 'PUBLISHED',
        eventDate:
            '2026-12-12T20:00:00',
        venueCode: 'VEN-SMR-01',
        venueName:
            'Marina Convention Center',
    },
    {
        id: 2,
        eventCode: 'TECH-2026',
        name: 'Tech Future Summit',
        category: 'TECHNOLOGY',
        status: 'PUBLISHED',
        eventDate:
            '2026-12-20T09:00:00',
        venueCode: 'VEN-BAQ-01',
        venueName: 'Centro Empresarial',
    },
]

const artistas = [
    {
        id: 1,
        stageName: 'Solar Beat',
        country: 'Colombia',
        genre: 'Electronic',
        active: true,
    },
]

function configurarCatalogo(
    eventosPublicados = eventos,
) {
    server.use(
        mockHttp.get(
            '/api/events/published',
            () =>
                HttpResponse.json(
                    eventosPublicados,
                ),
        ),
        mockHttp.get(
            '/api/artists/active',
            () =>
                HttpResponse.json(artistas),
        ),
    )
}

describe('CatalogoEventos', () => {
    it('muestra los eventos publicados', async () => {
        configurarCatalogo()

        renderConRouter(
            <CatalogoEventos />,
            {
                ruta: '/eventos',
                rutaInicial: '/eventos',
            },
        )

        expect(
            await screen.findByRole(
                'heading',
                {
                    name: 'Caribbean Music Fest',
                },
            ),
        ).toBeInTheDocument()

        expect(
            screen.getByRole(
                'heading',
                {
                    name: 'Tech Future Summit',
                },
            ),
        ).toBeInTheDocument()

        expect(
            screen.getByText('2 eventos'),
        ).toBeInTheDocument()
    })

    it('muestra estado vacío cuando no existen eventos publicados', async () => {
        configurarCatalogo([])

        renderConRouter(
            <CatalogoEventos />,
            {
                ruta: '/eventos',
                rutaInicial: '/eventos',
            },
        )

        expect(
            await screen.findByRole(
                'heading',
                {
                    name: 'Aún no hay eventos publicados',
                },
            ),
        ).toBeInTheDocument()

        expect(
            screen.getByText('0 eventos'),
        ).toBeInTheDocument()
    })

    it('actualiza la URL al filtrar por texto y categoría', async () => {
        const user = userEvent.setup()

        configurarCatalogo()

        const { router } =
            renderConRouter(
                <CatalogoEventos />,
                {
                    ruta: '/eventos',
                    rutaInicial: '/eventos',
                },
            )

        await screen.findByText(
            'Caribbean Music Fest',
        )

        await user.type(
            screen.getByRole('searchbox', {
                name: 'Buscar por nombre',
            }),
            'Caribbean',
        )

        await user.selectOptions(
            screen.getByRole('combobox', {
                name: 'Categoría',
            }),
            'MUSIC',
        )

        await waitFor(() => {
            expect(
                router.state.location.search,
            ).toContain('q=Caribbean')

            expect(
                router.state.location.search,
            ).toContain(
                'categoria=MUSIC',
            )
        })

        expect(
            screen.getByRole('heading', {
                name: 'Caribbean Music Fest',
            }),
        ).toBeInTheDocument()

        expect(
            screen.queryByRole('heading', {
                name: 'Tech Future Summit',
            }),
        ).not.toBeInTheDocument()
    })

    it('consulta eventos por artista cuando se selecciona un artista', async () => {
        const user = userEvent.setup()

        configurarCatalogo()

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
                        eventos[0],
                    ])
                },
            ),
        )

        const { router } =
            renderConRouter(
                <CatalogoEventos />,
                {
                    ruta: '/eventos',
                    rutaInicial: '/eventos',
                },
            )

        await screen.findByText(
            'Caribbean Music Fest',
        )

        await user.selectOptions(
            screen.getByRole('combobox', {
                name: 'Artista',
            }),
            'Solar Beat',
        )

        await waitFor(() => {
            expect(
                router.state.location.search,
            ).toContain(
                'artista=Solar+Beat',
            )
        })

        expect(
            await screen.findByText(
                '1 evento',
            ),
        ).toBeInTheDocument()
    })
})