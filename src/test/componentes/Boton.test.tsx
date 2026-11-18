import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Boton from '../../componentes/Boton'

describe('Boton', () => {
    it('muestra su contenido', () => {
        render(<Boton>Comprar entrada</Boton>)

        expect(
            screen.getByRole('button', { name: 'Comprar entrada' }),
        ).toBeInTheDocument()
    })

    it('se deshabilita mientras carga', () => {
        render(<Boton cargando>Comprar entrada</Boton>)

        expect(
            screen.getByRole('button', { name: 'Cargando…' }),
        ).toBeDisabled()
    })
})