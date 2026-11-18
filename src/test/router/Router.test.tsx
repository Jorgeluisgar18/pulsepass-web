import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { rutasAplicacion } from '../../router'

describe('Router de PulsePass', () => {
    it('muestra la página 404 ante una ruta inexistente', async () => {
        const router = createMemoryRouter(rutasAplicacion, {
            initialEntries: ['/ruta-que-no-existe'],
        })

        render(<RouterProvider router={router} />)

        expect(
            await screen.findByRole('heading', {
                name: 'No encontramos esta página',
            }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Volver al inicio' }),
        ).toBeInTheDocument()
    })
})