import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import Navbar from '../../layouts/Navbar'

function renderNavbar() {
    const router = createMemoryRouter(
        [
            {
                path: '*',
                element: <Navbar />,
            },
        ],
        {
            initialEntries: ['/'],
        },
    )

    render(<RouterProvider router={router} />)
}

describe('Navbar', () => {
    it('muestra la navegación pública de un visitante', () => {
        renderNavbar()

        expect(
            screen.getByRole('link', { name: 'Eventos' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Artistas' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Sedes' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ingresar' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Registrarse' }),
        ).toBeInTheDocument()
    })

    it('abre y cierra el menú móvil mediante teclado', async () => {
        const user = userEvent.setup()

        renderNavbar()

        const abrirMenu = screen.getByRole('button', {
            name: 'Abrir menú',
        })

        abrirMenu.focus()

        await user.keyboard('{Enter}')

        expect(
            screen.getByRole('button', { name: 'Cerrar menú' }),
        ).toHaveAttribute('aria-expanded', 'true')

        await user.keyboard('{Enter}')

        expect(
            screen.getByRole('button', { name: 'Abrir menú' }),
        ).toHaveAttribute('aria-expanded', 'false')
    })
})