import { screen } from '@testing-library/react'
import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it } from 'vitest'
import DetalleEvento from '../../pages/DetalleEvento'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const evento = {
  id: 1,
  eventCode: 'CMF-2026',
  name: 'Caribbean Music Fest 2026',
  description:
    'Tres noches de música caribeña frente a la bahía de Santa Marta.',
  category: 'MUSIC',
  status: 'PUBLISHED',
  eventDate: '2026-12-12T20:00:00',
  minimumAge: 18,
  streamingUrl: null,
  venueCode: 'VEN-SMR-01',
  venueName: 'Marina Convention Center',
  artists: [
    {
      id: 1,
      stageName: 'Solar Beat',
      country: 'Colombia',
      genre: 'Electronic',
      active: true,
    },
    {
      id: 2,
      stageName: 'Neon Waves',
      country: 'Colombia',
      genre: 'Electronic',
      active: true,
    },
  ],
}

function renderDetalle() {
  return renderConRouter(<DetalleEvento />, {
    ruta: '/eventos/:eventCode',
    rutaInicial: '/eventos/CMF-2026',
  })
}

describe('DetalleEvento', () => {
  it('muestra evento, artistas y sede', async () => {
    server.use(
      mockHttp.get('/api/events/CMF-2026', () => HttpResponse.json(evento)),
    )

    renderDetalle()

    expect(
      await screen.findByRole('heading', {
        name: 'Caribbean Music Fest 2026',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Solar Beat')).toBeInTheDocument()

    expect(screen.getByText('Neon Waves')).toBeInTheDocument()

    expect(screen.getByText('Marina Convention Center')).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'Inicia sesión para comprar',
      }),
    ).toHaveAttribute('href', '/login')
  })

  it('muestra Evento no disponible ante 404', async () => {
    server.use(
      mockHttp.get('/api/events/CMF-2026', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-21T23:00:00',
            status: 404,
            error: 'Not Found',
            message: 'Event not found: CMF-2026',
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
        name: 'Evento no disponible',
      }),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Event not found: CMF-2026'),
    ).not.toBeInTheDocument()
  })

  it('deshabilita la compra cuando el evento está SOLD_OUT', async () => {
    server.use(
      mockHttp.get('/api/events/CMF-2026', () =>
        HttpResponse.json({
          ...evento,
          status: 'SOLD_OUT',
        }),
      ),
    )

    renderDetalle()

    const boton = await screen.findByRole('button', {
      name: 'Compra no disponible',
    })

    expect(boton).toBeDisabled()

    expect(screen.getByText('El evento está agotado.')).toBeInTheDocument()
  })

  it('muestra estado vacío cuando el evento no tiene artistas asociados', async () => {
    server.use(
      mockHttp.get('/api/events/CMF-2026', () =>
        HttpResponse.json({
          ...evento,
          artists: [],
        }),
      ),
    )

    renderDetalle()

    expect(
      await screen.findByText('Aún no hay artistas asociados.'),
    ).toBeInTheDocument()
  })
})
