import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Aviso from '../../componentes/Aviso'

describe('Aviso accesible', () => {
  it.each([
    ['exito', 'status', 'Cuenta creada'],
    ['error', 'alert', 'Credenciales inválidas'],
    ['info', 'status', 'Información disponible'],
    ['advertencia', 'status', 'Tu sesión está por expirar'],
  ] as const)('presenta el tipo %s con rol %s y variantes oscuras', (tipo, rol, texto) => {
    render(<Aviso tipo={tipo}>{texto}</Aviso>)

    expect(screen.getByRole(rol)).toHaveTextContent(texto)

    const aviso = screen.getByRole(rol)
    expect(aviso.className).toContain('dark:')
  })
})
