import { screen } from '@testing-library/react'
import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it } from 'vitest'
import ListaSedes from '../../pages/ListaSedes'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const sedes = [
  {
    id: 1,
    code: 'VEN-SMR-01',
    name: 'Marina Convention Center',
    city: 'Santa Marta',
    address: 'Carrera 1 # 22-93',
    capacity: 3,
    active: true,
  },
  {
    id: 2,
    code: 'VEN-BAQ-01',
    name: 'Centro de Convenciones Caribe',
    city: 'Barranquilla',
    address: 'Calle 72 # 50-25',
    capacity: 1200,
    active: true,
  },
]

describe('ListaSedes', () => {
  it('lista las sedes activas con ciudad y capacidad', async () => {
    server.use(
      mockHttp.get('/api/venues/active', () => HttpResponse.json(sedes)),
    )

    renderConRouter(<ListaSedes />, {
      ruta: '/sedes',
      rutaInicial: '/sedes',
    })

    expect(
      await screen.findByRole('heading', {
        name: 'Marina Convention Center',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Centro de Convenciones Caribe',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Santa Marta · Cap. 3')).toBeInTheDocument()

    expect(screen.getByText('Barranquilla · Cap. 1.200')).toBeInTheDocument()

    expect(screen.getAllByText('Activa')).toHaveLength(2)

    expect(
      screen.getByRole('link', {
        name: /Marina Convention Center/,
      }),
    ).toHaveAttribute('href', '/sedes/VEN-SMR-01')
  })

  it('muestra estado vacío cuando no existen sedes activas', async () => {
    server.use(mockHttp.get('/api/venues/active', () => HttpResponse.json([])))

    renderConRouter(<ListaSedes />, {
      ruta: '/sedes',
      rutaInicial: '/sedes',
    })

    expect(
      await screen.findByRole('heading', {
        name: 'Aún no hay sedes disponibles',
      }),
    ).toBeInTheDocument()
  })
})
