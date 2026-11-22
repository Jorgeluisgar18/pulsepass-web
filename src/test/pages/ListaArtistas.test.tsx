import { screen } from '@testing-library/react'
import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it } from 'vitest'
import ListaArtistas from '../../pages/ListaArtistas'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

describe('ListaArtistas', () => {
  it('lista los artistas activos', async () => {
    server.use(
      mockHttp.get('/api/artists/active', () =>
        HttpResponse.json([
          {
            id: 1,
            stageName: 'Solar Beat',
            country: 'Colombia',
            genre: 'Electrónica',
            active: true,
          },
          {
            id: 2,
            stageName: 'Neon Waves',
            country: 'Colombia',
            genre: 'Synthwave',
            active: true,
          },
        ]),
      ),
    )

    renderConRouter(<ListaArtistas />, {
      ruta: '/artistas',
      rutaInicial: '/artistas',
    })

    expect(
      await screen.findByRole('heading', {
        name: 'Solar Beat',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Neon Waves',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Electrónica')).toBeInTheDocument()
  })
})
