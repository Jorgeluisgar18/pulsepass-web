import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../../funcionalidades/auth/AuthContext'
import RutaPorRol from '../../../funcionalidades/auth/componentes/RutaPorRol'
import type { Rol } from '../../../funcionalidades/auth/tipos'
import type { Evento } from '../../../funcionalidades/eventos/tipos'
import AdminCrearEvento from '../../../pages/AdminCrearEvento'
import CatalogoEventos from '../../../pages/CatalogoEventos'
import AdminEventos from '../../../pages/AdminEventos'
import AdminGestionEvento from '../../../pages/AdminGestionEvento'
import { server } from '../../mocks/server'

const eventoBase: Evento = {
  id: 91,
  eventCode: 'CMF-2027',
  name: 'Caribbean Music Fest 2027',
  description: 'Festival de música del Caribe.',
  category: 'MUSIC',
  status: 'DRAFT',
  eventDate: '2027-09-03T20:30:00',
  minimumAge: 16,
  streamingUrl: null,
  venueCode: 'BGT-ARENA',
  venueName: 'Bogotá Arena',
  artists: [],
}

const sedeActiva = {
  id: 8,
  code: 'BGT-ARENA',
  name: 'Bogotá Arena',
  city: 'Bogotá',
  address: 'Calle 1 # 2-3',
  capacity: 12000,
  active: true,
}

const artistaActivo = {
  id: 14,
  stageName: 'Luna Norte',
  country: 'Colombia',
  genre: 'Pop',
  active: true,
}

function respuestaError(status: number, message: string, details: Record<string, string> = {}) {
  return HttpResponse.json(
    {
      timestamp: '2026-11-23T18:30:00',
      status,
      error: 'Business error',
      message,
      details,
    },
    { status },
  )
}

function prepararSesion(roles: Rol[] = ['ADMIN']) {
  window.sessionStorage.setItem(
    'pulsepass_sesion',
    JSON.stringify({
      token: 'admin-token',
      expiraEn: Date.now() + 60_000,
      usuario: {
        userId: 901,
        username: 'admin',
        email: 'admin@example.com',
        roles,
      },
    }),
  )

  server.use(
    mockHttp.get('/api/auth/me', ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer admin-token')
      return HttpResponse.json({
        userId: 901,
        username: 'admin',
        email: 'admin@example.com',
        roles,
      })
    }),
  )
}

function renderAdmin(rutaInicial: string, roles: Rol[] = ['ADMIN']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
  const router = createMemoryRouter(
    [
      {
        element: (
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        ),
        children: [
          {
            element: <RutaPorRol rolesPermitidos={['ADMIN']} />,
            children: [
              { path: 'admin/eventos', element: <AdminEventos /> },
              { path: 'admin/eventos/nuevo', element: <AdminCrearEvento /> },
              { path: 'admin/eventos/:eventCode', element: <AdminGestionEvento /> },
            ],
          },
          { path: 'eventos', element: <CatalogoEventos /> },
          { path: '403', element: <div>Sin permisos</div> },
          { path: 'staff/eventos/:eventCode/tickets', element: <div>Tickets pagados</div> },
        ],
      },
    ],
    { initialEntries: [rutaInicial] },
  )

  prepararSesion(roles)
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { queryClient, router }
}

async function completarFormularioEvento(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'Código del evento' }), 'CMF-2027')
  await user.type(screen.getByRole('textbox', { name: 'Nombre del evento' }), eventoBase.name)
  await user.type(screen.getByRole('textbox', { name: 'Descripción' }), eventoBase.description ?? '')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Categoría' }), 'MUSIC')
  await user.type(screen.getByLabelText('Fecha y hora'), '2027-09-03T20:30')
  await user.type(screen.getByRole('spinbutton', { name: 'Edad mínima' }), '16')
  await user.selectOptions(screen.getByRole('combobox', { name: 'Sede' }), 'BGT-ARENA')
}

describe('flujos ADMIN de eventos', () => {
  it('extra: limita la descripción a 500 caracteres y refleja el contador visible', async () => {
    server.use(
      mockHttp.get('/api/venues/active', () => HttpResponse.json([sedeActiva])),
    )
    const user = userEvent.setup()
    renderAdmin('/admin/eventos/nuevo')

    const descripcion = await screen.findByRole('textbox', { name: 'Descripción' })
    expect(descripcion).toHaveAttribute('maxLength', '500')
    expect(screen.getByText('0/500')).toBeInTheDocument()

    await user.type(descripcion, 'PulsePass')
    expect(screen.getByText('9/500')).toBeInTheDocument()
  })

  it('extra: busca un evento con ADMIN JWT sin consultar un listado completo', async () => {
    let consultasEvento = 0
    let consultasListado = 0
    server.use(
      mockHttp.get('/api/events', () => {
        consultasListado += 1
        return HttpResponse.json([eventoBase])
      }),
      mockHttp.get('/api/events/CMF-2027', ({ request }) => {
        consultasEvento += 1
        expect(request.headers.get('Authorization')).toBe('Bearer admin-token')
        return HttpResponse.json(eventoBase)
      }),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artistaActivo])),
    )

    const user = userEvent.setup()
    renderAdmin('/admin/eventos')

    expect(await screen.findByRole('link', { name: 'Crear evento' })).toBeInTheDocument()
    expect(consultasEvento).toBe(0)
    await user.click(screen.getByRole('button', { name: 'Buscar evento' }))
    expect(consultasEvento).toBe(0)
    expect(screen.getByText('Ingresa el código del evento.')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Código del evento' }), 'CMF-2027')
    await user.click(screen.getByRole('button', { name: 'Buscar evento' }))

    expect(await screen.findByRole('heading', { name: eventoBase.name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gestionar evento' })).toHaveAttribute(
      'href',
      '/admin/eventos/CMF-2027',
    )
    await user.click(screen.getByRole('link', { name: 'Gestionar evento' }))
    expect(await screen.findByText('Artistas asociados')).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Ver tickets pagados' })).toHaveAttribute(
      'href',
      '/staff/eventos/CMF-2027/tickets',
    )
    expect(consultasListado).toBe(0)
    await user.click(screen.getByRole('link', { name: 'Volver a eventos' }))
    expect(await screen.findByText('Todavía no has creado eventos en esta sesión.')).toBeInTheDocument()
  })

  it('TEST-FE-ADM-001 valida campos requeridos sin peticiones y TEST-FE-ADM-002 crea el evento con tipos y fecha local del backend', async () => {
    let solicitudesCreacion = 0
    server.use(
      mockHttp.get('/api/venues/active', () => HttpResponse.json([sedeActiva])),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artistaActivo])),
      mockHttp.post('/api/events', async ({ request }) => {
        solicitudesCreacion += 1
        expect(request.headers.get('Authorization')).toBe('Bearer admin-token')
        expect(await request.json()).toEqual({
          eventCode: 'CMF-2027',
          name: eventoBase.name,
          description: eventoBase.description,
          category: 'MUSIC',
          eventDate: '2027-09-03T20:30',
          minimumAge: 16,
          venueCode: 'BGT-ARENA',
        })
        return HttpResponse.json(eventoBase, { status: 201 })
      }),
      mockHttp.get('/api/events/CMF-2027', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer admin-token')
        return HttpResponse.json(eventoBase)
      }),
    )

    const user = userEvent.setup()
    const { router } = renderAdmin('/admin/eventos/nuevo')
    await screen.findByRole('option', { name: /Bogotá Arena/ })

    await user.click(screen.getByRole('button', { name: 'Crear evento' }))
    expect(await screen.findByText('El código del evento es obligatorio.')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Categoría' })).toHaveAccessibleDescription(/.+/)
    expect(screen.getByRole('combobox', { name: 'Sede' })).toHaveAccessibleDescription(/.+/)
    expect(solicitudesCreacion).toBe(0)

    await completarFormularioEvento(user)
    await user.click(screen.getByRole('button', { name: 'Crear evento' }))

    expect(await screen.findByRole('heading', { name: eventoBase.name })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/eventos/CMF-2027')
    expect(solicitudesCreacion).toBe(1)
  })

  it('mantiene la relación local de eventos creados durante la sesión y actualiza solo eventos creados', async () => {
    let evento = eventoBase
    server.use(
      mockHttp.get('/api/venues/active', () => HttpResponse.json([sedeActiva])),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artistaActivo])),
      mockHttp.post('/api/events', () => HttpResponse.json(eventoBase, { status: 201 })),
      mockHttp.get('/api/events/CMF-2027', () => HttpResponse.json(evento)),
      mockHttp.patch('/api/events/CMF-2027/publish', () => {
        evento = { ...evento, status: 'PUBLISHED' }
        return HttpResponse.json(evento)
      }),
    )

    const user = userEvent.setup()
    renderAdmin('/admin/eventos/nuevo')
    await screen.findByRole('option', { name: /Bogotá Arena/ })
    await completarFormularioEvento(user)
    await user.click(screen.getByRole('button', { name: 'Crear evento' }))
    await screen.findByRole('heading', { name: eventoBase.name })
    await user.click(screen.getByRole('link', { name: 'Volver a eventos' }))

    const eventoLocal = await screen.findByRole('link', { name: /Caribbean Music Fest 2027/ })
    expect(eventoLocal).toHaveAttribute('href', '/admin/eventos/CMF-2027')
    await user.click(eventoLocal)
    expect(await screen.findByRole('button', { name: 'Publicar evento' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Publicar evento' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Confirmar publicación' }))
    expect(await screen.findByText('Publicado')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Volver a eventos' }))
    expect(await screen.findByRole('link', { name: /Caribbean Music Fest 2027/ })).toHaveTextContent('Publicado')
  })

  it('TEST-FE-ADM-003 asigna detalles 400 a los campos y conserva el formulario', async () => {
    server.use(
      mockHttp.get('/api/venues/active', () => HttpResponse.json([sedeActiva])),
      mockHttp.post('/api/events', () =>
        respuestaError(400, 'Revisa los datos del evento.', {
          eventCode: 'El código contiene un valor no permitido.',
          serverRule: 'La descripción no cumple la política vigente.',
        }),
      ),
    )

    const user = userEvent.setup()
    renderAdmin('/admin/eventos/nuevo')
    await screen.findByRole('option', { name: /Bogotá Arena/ })
    await completarFormularioEvento(user)
    await user.click(screen.getByRole('button', { name: 'Crear evento' }))

    expect(await screen.findByText('El código contiene un valor no permitido.')).toBeInTheDocument()
    expect(screen.getByText(/Revisa los datos del evento\./)).toHaveTextContent('La descripción no cumple la política vigente.')
    expect(screen.getByRole('textbox', { name: 'Nombre del evento' })).toHaveValue(eventoBase.name)
  })

  it('mantiene el conflicto 409 visible sin perder los datos del formulario', async () => {
    server.use(
      mockHttp.get('/api/venues/active', () => HttpResponse.json([sedeActiva])),
      mockHttp.post('/api/events', () =>
        respuestaError(409, 'Ya existe un evento con ese código.'),
      ),
    )

    const user = userEvent.setup()
    renderAdmin('/admin/eventos/nuevo')
    await screen.findByRole('option', { name: /Bogotá Arena/ })
    await completarFormularioEvento(user)
    await user.click(screen.getByRole('button', { name: 'Crear evento' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un evento con ese código.')
    expect(screen.getByRole('textbox', { name: 'Nombre del evento' })).toHaveValue(eventoBase.name)
  })

  it('TEST-FE-ADM-004 publica el DRAFT, actualiza el detalle y lo muestra en cartelera', async () => {
    let evento = eventoBase
    let consultasPublicadas = 0
    server.use(
      mockHttp.get('/api/events/CMF-2027', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer admin-token')
        return HttpResponse.json(evento)
      }),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artistaActivo])),
      mockHttp.patch('/api/events/CMF-2027/publish', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer admin-token')
        evento = { ...evento, status: 'PUBLISHED' }
        return HttpResponse.json(evento)
      }),
    )

    server.use(mockHttp.get('/api/events/published', () => {
      consultasPublicadas += 1
      return HttpResponse.json(evento.status === 'PUBLISHED' ? [evento] : [])
    }))
    const user = userEvent.setup()
    const { queryClient, router } = renderAdmin('/eventos')
    expect(await screen.findByText('Aún no hay eventos publicados.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: eventoBase.name })).not.toBeInTheDocument()
    expect(consultasPublicadas).toBe(1)
    await router.navigate('/admin/eventos/CMF-2027')
    expect(await screen.findByText('Borrador')).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: 'Luna Norte' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Publicar evento' }))
    const dialog = screen.getByRole('dialog', { name: 'Publicar evento' })
    expect(within(dialog).getByText(/Esta acción hará público el evento/)).toBeInTheDocument()
    expect(screen.getByText('Borrador')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar publicación' }))

    expect(await screen.findByText('Publicado')).toBeInTheDocument()
    expect(queryClient.getQueryData(['evento', 'CMF-2027'])).toMatchObject({ status: 'PUBLISHED' })
    await router.navigate('/eventos')
    expect(await screen.findByRole('heading', { name: 'Cartelera' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: eventoBase.name })).toBeInTheDocument()
    expect(consultasPublicadas).toBeGreaterThan(1)
  })

  it('TEST-FE-ADM-005 conserva el estado DRAFT y la confirmación ante 409 al publicar', async () => {
    server.use(
      mockHttp.get('/api/events/CMF-2027', () => HttpResponse.json(eventoBase)),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artistaActivo])),
      mockHttp.patch('/api/events/CMF-2027/publish', () =>
        respuestaError(409, 'La sede del evento está inactiva.'),
      ),
    )

    const user = userEvent.setup()
    renderAdmin('/admin/eventos/CMF-2027')
    expect(await screen.findByText('Borrador')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Publicar evento' }))
    const dialog = screen.getByRole('dialog', { name: 'Publicar evento' })
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar publicación' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('La sede del evento está inactiva.')
    expect(screen.getByRole('dialog', { name: 'Publicar evento' })).toBeInTheDocument()
    expect(screen.getByText('Borrador')).toBeInTheDocument()
  })

  it('TEST-FE-ADM-006 asocia artistas activos y conserva la respuesta ante conflicto duplicado', async () => {
    let evento = eventoBase
    let asociaciones = 0
    server.use(
      mockHttp.get('/api/events/CMF-2027', () => HttpResponse.json(evento)),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artistaActivo])),
      mockHttp.post('/api/events/CMF-2027/artists/14', () => {
        asociaciones += 1
        if (asociaciones > 1) {
          return respuestaError(409, 'El artista ya está asociado a este evento.')
        }
        evento = { ...evento, artists: [artistaActivo] }
        return HttpResponse.json(evento)
      }),
    )

    const user = userEvent.setup()
    const { queryClient } = renderAdmin('/admin/eventos/CMF-2027')
    queryClient.setQueryData(['eventos', 'artista', 'Luna Norte'], [])
    queryClient.setQueryData(['evento', 'CMF-2027'], eventoBase)
    expect(await screen.findByText('Artistas asociados')).toBeInTheDocument()
    await user.selectOptions(await screen.findByRole('combobox', { name: 'Artista activo' }), '14')
    await user.click(screen.getByRole('button', { name: 'Asociar artista' }))
    expect(await screen.findByRole('heading', { name: 'Luna Norte' })).toBeInTheDocument()
    expect(queryClient.getQueryData(['admin', 'evento', 901, 'CMF-2027'])).toMatchObject({
      artists: [artistaActivo],
    })
    expect(queryClient.getQueryState(['eventos', 'artista', 'Luna Norte'])?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['evento', 'CMF-2027'])?.isInvalidated).toBe(true)

    await user.selectOptions(screen.getByRole('combobox', { name: 'Artista activo' }), '14')
    await user.click(screen.getByRole('button', { name: 'Asociar artista' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('El artista ya está asociado a este evento.')
    expect(screen.getByRole('heading', { name: 'Luna Norte' })).toBeInTheDocument()
  })

  it('presenta un mensaje genérico y conserva el acceso bloqueado para STAFF', async () => {
    let solicitudesEventos = 0
    server.use(
      mockHttp.get('/api/events/:eventCode', () => {
        solicitudesEventos += 1
        return HttpResponse.json(eventoBase)
      }),
      mockHttp.get('/api/venues/active', () => HttpResponse.json([sedeActiva])),
      mockHttp.post('/api/events', () => respuestaError(403, 'No autorizado.')),
    )

    const user = userEvent.setup()
    renderAdmin('/admin/eventos/CMF-2027', ['STAFF'])
    expect(await screen.findByText('Sin permisos')).toBeInTheDocument()
    expect(solicitudesEventos).toBe(0)

    cleanup()
    renderAdmin('/admin/eventos/nuevo', ['ADMIN'])
    await screen.findByRole('option', { name: /Bogotá Arena/ })
    await completarFormularioEvento(user)
    await user.click(screen.getByRole('button', { name: 'Crear evento' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('No tienes permisos para realizar esta operación.')
  })
})
