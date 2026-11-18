import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Campo from '../../componentes/Campo'

describe('Campo', () => {
    it('asocia la etiqueta con el input', () => {
        render(<Campo etiqueta="Correo electrónico" />)

        expect(
            screen.getByRole('textbox', { name: 'Correo electrónico' }),
        ).toBeInTheDocument()
    })

    it('marca el campo como inválido cuando existe error', () => {
        render(
            <Campo
                etiqueta="Correo electrónico"
                error="Correo inválido"
            />,
        )

        expect(
            screen.getByRole('textbox', { name: 'Correo electrónico' }),
        ).toHaveAttribute('aria-invalid', 'true')

        expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido')
    })
})