import { screen } from '@testing-library/react'
import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it } from 'vitest'
import DetalleSede from '../../pages/DetalleSede'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const sede = {
  id: 1,
  code: 'VEN-SMR-01',
  name: 'Marina Convention Center',
  city: 'Santa Marta',
  address: 'Carrera 1 # 22-93',
  capacity: 3,
  active: true,
}

function renderDetalle() {
  return renderConRouter(<DetalleSede />, {
    ruta: '/sedes/:code',
    rutaInicial: '/sedes/VEN-SMR-01',
  })
}

describe('DetalleSede', () => {
  it('muestra el detalle de una sede', async () => {
    server.use(
      mockHttp.get('/api/venues/VEN-SMR-01', () => HttpResponse.json(sede)),
    )

    renderDetalle()

    expect(
      await screen.findByRole('heading', {
        name: 'Marina Convention Center',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('VEN-SMR-01')).toBeInTheDocument()

    expect(screen.getByText('Santa Marta')).toBeInTheDocument()

    expect(screen.getByText('3 personas')).toBeInTheDocument()

    expect(screen.getByText('Carrera 1 # 22-93')).toBeInTheDocument()
  })

  it('muestra 404 cuando la sede no existe', async () => {
    server.use(
      mockHttp.get('/api/venues/VEN-SMR-01', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-21T23:00:00',
            status: 404,
            error: 'Not Found',
            message: 'Venue not found: VEN-SMR-01',
            details: {},
          },
          {
            status: 404,
          },
        ),
      ),
    )

    renderDetalle()

    expect(
      await screen.findByRole('heading', {
        name: 'No encontramos esta página',
      }),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Venue not found: VEN-SMR-01'),
    ).not.toBeInTheDocument()
  })
})
