import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import {
    createMemoryRouter,
    type RouteObject,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from '../../funcionalidades/auth/AuthContext'

interface RenderConRouterOpciones {
    rutaInicial?: string
    ruta?: string
}

export function renderConRouter(
    elemento: ReactElement,
    {
        rutaInicial = '/',
        ruta = '/',
    }: RenderConRouterOpciones = {},
) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    })

    const rutas: RouteObject[] = [
        {
            path: ruta,
            element: <AuthProvider>{elemento}</AuthProvider>,
        },
    ]

    const router = createMemoryRouter(
        rutas,
        {
            initialEntries: [rutaInicial],
        },
    )

    render(
        <QueryClientProvider
            client={queryClient}
        >
            <RouterProvider router={router} />
        </QueryClientProvider>,
    )

    return {
        router,
        queryClient,
    }
}
