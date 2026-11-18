import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import ErrorPagina from '../../pages/ErrorPagina'

describe('ErrorPagina', () => {
    it('muestra un mensaje seguro sin exponer detalles internos', async () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/',
                    loader: () => {
                        throw new Error('DETALLE_INTERNO_NO_DEBE_MOSTRARSE')
                    },
                    element: <div />,
                    errorElement: <ErrorPagina />,
                },
            ],
            {
                initialEntries: ['/'],
            },
        )

        render(<RouterProvider router={router} />)

        expect(
            await screen.findByRole('heading', {
                name: '¡Ups! Algo salió mal.',
            }),
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                'Ocurrió un error inesperado. Inténtalo más tarde.',
            ),
        ).toBeInTheDocument()

        expect(
            screen.queryByText('DETALLE_INTERNO_NO_DEBE_MOSTRARSE'),
        ).not.toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: 'Reintentar' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Volver al inicio' }),
        ).toBeInTheDocument()
    })
})