import { screen } from '@testing-library/react'
import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import DetalleArtista from '../../pages/DetalleArtista'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const artista = {
  id: 1,
  stageName: 'Solar Beat',
  country: 'Colombia',
  genre: 'Electrónica',
  active: true,
}

const evento = {
  id: 1,
  eventCode: 'CMF-2026',
  name: 'Caribbean Music Fest 2026',
  category: 'MUSIC',
  status: 'PUBLISHED',
  eventDate: '2026-12-12T20:00:00',
  venueCode: 'VEN-SMR-01',
  venueName: 'Marina Convention Center',
}

function renderDetalle(rutaInicial = '/artistas/1') {
  return renderConRouter(<DetalleArtista />, {
    ruta: '/artistas/:id',
    rutaInicial,
  })
}

describe('DetalleArtista', () => {
  it('muestra el artista y sus eventos asociados', async () => {
    server.use(
      mockHttp.get('/api/artists/1', () => HttpResponse.json(artista)),
      mockHttp.get('/api/events/by-artist', ({ request }) => {
        const url = new URL(request.url)

        expect(url.searchParams.get('stageName')).toBe('Solar Beat')

        return HttpResponse.json([evento])
      }),
    )

    renderDetalle()

    expect(
      await screen.findByRole('heading', {
        name: 'Solar Beat',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Electrónica · Colombia')).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: 'Caribbean Music Fest 2026',
      }),
    ).toBeInTheDocument()
  })

  it('muestra Sin eventos próximos cuando el artista no tiene eventos publicados', async () => {
    server.use(
      mockHttp.get('/api/artists/1', () => HttpResponse.json(artista)),
      mockHttp.get('/api/events/by-artist', () => HttpResponse.json([])),
    )

    renderDetalle()

    expect(
      await screen.findByRole('heading', {
        name: 'Sin eventos próximos',
      }),
    ).toBeInTheDocument()
  })

  it('muestra 404 cuando el artista no existe', async () => {
    server.use(
      mockHttp.get('/api/artists/999', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-21T23:00:00',
            status: 404,
            error: 'Not Found',
            message: 'Artist not found: 999',
            details: {},
          },
          {
            status: 404,
          },
        ),
      ),
    )

    renderDetalle('/artistas/999')

    expect(
      await screen.findByRole('heading', {
        name: 'No encontramos esta página',
      }),
    ).toBeInTheDocument()

    expect(screen.queryByText('Artist not found: 999')).not.toBeInTheDocument()
  })

  it('id no numérico muestra 404 sin llamar a la API', async () => {
    const llamadaApi = vi.fn()

    server.use(
      mockHttp.get('/api/artists/:id', () => {
        llamadaApi()

        return HttpResponse.json(artista)
      }),
    )

    renderDetalle('/artistas/no-valido')

    expect(
      await screen.findByRole('heading', {
        name: 'No encontramos esta página',
      }),
    ).toBeInTheDocument()

    expect(llamadaApi).not.toHaveBeenCalled()
  })
})
