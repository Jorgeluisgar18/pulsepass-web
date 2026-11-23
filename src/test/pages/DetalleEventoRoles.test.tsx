import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../../funcionalidades/auth/contexto'
import type {
  AuthContextValor,
  EstadoSesion,
  Rol,
} from '../../funcionalidades/auth/tipos'
import DetalleEvento from '../../pages/DetalleEvento'
import { server } from '../mocks/server'

const evento = {
  id: 1,
  eventCode: 'CMF-2026',
  name: 'Caribbean Music Fest 2026',
  description: 'Tres noches de música caribeña frente a la bahía de Santa Marta.',
  category: 'MUSIC',
  status: 'PUBLISHED',
  eventDate: '2026-12-12T20:00:00',
  minimumAge: 18,
  streamingUrl: null,
  venueCode: 'VEN-SMR-01',
  venueName: 'Marina Convention Center',
  artists: [],
}

const usuario = {
  userId: 42,
  username: 'ana',
  email: 'ana@example.com',
}

function sesionAutenticada(roles: Rol[]): EstadoSesion {
  return {
    estado: 'autenticado',
    usuario: { ...usuario, roles },
    token: 'test-token',
    expiraEn: Date.now() + 60_000,
  }
}

function renderDetalle(sesion: EstadoSesion, estadoEvento = 'PUBLISHED') {
  server.use(
    mockHttp.get('/api/events/CMF-2026', () =>
      HttpResponse.json({ ...evento, status: estadoEvento }),
    ),
  )

  const contexto: AuthContextValor = {
    sesion,
    iniciarSesion: async () => {},
    cerrarSesion: () => {},
    tieneRol: () => false,
  }
  const router = createMemoryRouter(
    [
      {
        path: '/eventos/:eventCode',
        element: (
          <AuthContext.Provider value={contexto}>
            <DetalleEvento />
          </AuthContext.Provider>
        ),
      },
    ],
    { initialEntries: ['/eventos/CMF-2026'] },
  )
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

function expectCompraOcultaSinEspacio() {
  expect(
    screen.queryByRole('heading', { name: 'Entradas' }),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: 'Inicia sesión para comprar' }),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: 'Comprar entradas (próximamente)' }),
  ).not.toBeInTheDocument()

  const articulo = screen.getByRole('article')
  const contenedor = articulo.closest('.mx-auto.max-w-6xl')
  expect(contenedor).not.toHaveClass('pb-28')
  expect(contenedor).not.toHaveClass('md:pb-12')
  expect(articulo.parentElement).not.toHaveClass('grid')
}

describe('visibilidad de compra en DetalleEvento', () => {
  it.each([
    ['STAFF', ['STAFF'] as Rol[]],
    ['ADMIN', ['ADMIN'] as Rol[]],
    ['USER y STAFF', ['USER', 'STAFF'] as Rol[]],
    ['USER y ADMIN', ['USER', 'ADMIN'] as Rol[]],
  ])('oculta íntegramente la compra para una sesión con %s', async (_, roles) => {
    renderDetalle(sesionAutenticada(roles))

    expect(
      await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' }),
    ).toBeInTheDocument()
    expectCompraOcultaSinEspacio()
  })

  it('no muestra acciones ni reserva espacio mientras la sesión carga', async () => {
    renderDetalle({ estado: 'cargando', usuario: null, token: null })

    expect(
      await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' }),
    ).toBeInTheDocument()
    expectCompraOcultaSinEspacio()
  })

  it('conserva el acceso de compra para visitantes', async () => {
    renderDetalle({ estado: 'anonimo', usuario: null, token: null })

    const enlacesCompra = await screen.findAllByRole('link', {
      name: 'Inicia sesión para comprar',
    })

    expect(enlacesCompra).toHaveLength(2)
    enlacesCompra.forEach((enlace) => {
      expect(enlace).toHaveAttribute('href', '/login')
    })
  })

  it('conserva el placeholder de compra para USER autenticado', async () => {
    renderDetalle(sesionAutenticada(['USER']))

    const botones = await screen.findAllByRole('button', {
      name: 'Comprar entradas (próximamente)',
    })

    expect(botones).toHaveLength(2)
    botones.forEach((boton) => {
      expect(boton).toBeDisabled()
    })
  })

  it('conserva el motivo y la acción deshabilitada para un evento agotado', async () => {
    renderDetalle({ estado: 'anonimo', usuario: null, token: null }, 'SOLD_OUT')

    const botones = await screen.findAllByRole('button', {
      name: 'Compra no disponible',
    })

    expect(botones).toHaveLength(2)
    botones.forEach((boton) => {
      expect(boton).toBeDisabled()
    })
    expect(screen.getByText('El evento está agotado.')).toBeInTheDocument()
  })
})
