import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../../funcionalidades/auth/AuthContext'
import RutaPorRol from '../../../funcionalidades/auth/componentes/RutaPorRol'
import type { Rol } from '../../../funcionalidades/auth/tipos'
import { marcarTicketUsadoApi } from '../../../funcionalidades/tickets/api'
import TicketsPagadosEvento from '../../../pages/TicketsPagadosEvento'
import ValidacionIngreso from '../../../pages/ValidacionIngreso'
import { server } from '../../mocks/server'

const ticketBase = {
  id: 12,
  ticketCode: 'TKT-2026-ABC123',
  type: 'GENERAL',
  price: 125000,
  status: 'PAID',
  purchaseDate: '2026-11-23T18:30:00',
  userEmail: 'cliente@example.com',
  eventCode: 'CMF-2026',
  eventName: 'Caribbean Music Fest 2026',
}

function respuestaError(status: number, message: string) {
  return HttpResponse.json(
    {
      timestamp: '2026-11-23T18:30:00',
      status,
      error: 'Business error',
      message,
      details: {},
    },
    { status },
  )
}

function prepararSesion(roles: Rol[] = ['STAFF']) {
  window.sessionStorage.setItem(
    'pulsepass_sesion',
    JSON.stringify({
      token: 'staff-token',
      expiraEn: Date.now() + 60_000,
      usuario: {
        userId: 77,
        username: 'staff',
        email: 'stale-session@example.com',
        roles,
      },
    }),
  )

  server.use(
    mockHttp.get('/api/auth/me', ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer staff-token')
      return HttpResponse.json({
        userId: 77,
        username: 'staff',
        email: 'staff@example.com',
        roles,
      })
    }),
  )
}

function renderStaff(rutaInicial: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
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
            element: <RutaPorRol rolesPermitidos={['STAFF', 'ADMIN']} />,
            children: [
              { path: 'staff/validacion', element: <ValidacionIngreso /> },
              {
                path: 'staff/eventos/:eventCode/tickets',
                element: <TicketsPagadosEvento />,
              },
            ],
          },
          { path: '403', element: <div>Sin permisos</div> },
        ],
      },
    ],
    { initialEntries: [rutaInicial] },
  )

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { queryClient, router }
}

describe('flujos STAFF de tickets', () => {
  it('TEST-FE-STF-001 busca bajo demanda con Enter y marca como usado solo tras 200', async () => {
    prepararSesion()
    let consultas = 0
    let solicitudesPorEmail = 0
    let ticket = { ...ticketBase }
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', ({ request }) => {
        consultas += 1
        expect(request.headers.get('Authorization')).toBe('Bearer staff-token')
        return HttpResponse.json(ticket)
      }),
      mockHttp.patch('/api/tickets/TKT-2026-ABC123/use', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer staff-token')
        ticket = { ...ticket, status: 'USED' }
        return HttpResponse.json(ticket)
      }),
      mockHttp.get('/api/users/by-email', () => {
        solicitudesPorEmail += 1
        return HttpResponse.json({})
      }),
    )

    const user = userEvent.setup()
    const { queryClient } = renderStaff('/staff/validacion')
    const codigo = await screen.findByRole('textbox', { name: 'Código de ticket' })

    expect(codigo).toHaveFocus()
    expect(consultas).toBe(0)
    await user.type(codigo, 'TKT-2026-ABC123')
    expect(consultas).toBe(0)
    await user.keyboard('{Enter}')

    expect(await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' })).toBeInTheDocument()
    expect(screen.getByText('cliente@example.com')).toBeInTheDocument()
    expect(screen.getByText('Pagado')).toBeInTheDocument()
    expect(consultas).toBe(1)
    expect(solicitudesPorEmail).toBe(0)

    await user.click(screen.getByRole('button', { name: 'Marcar como usado' }))

    expect(await screen.findByText('Usado')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Ticket marcado como usado.')
    expect(codigo).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Marcar como usado' })).not.toBeInTheDocument()
    expect(codigo).toHaveFocus()
    expect(
      queryClient.getQueryData(['tickets', 'detalle', 'TKT-2026-ABC123', 'staff@example.com']),
    ).toMatchObject({ status: 'USED', userEmail: 'cliente@example.com' })
    expect(
      queryClient.getQueryData(['tickets', 'detalle', 'TKT-2026-ABC123', 'cliente@example.com']),
    ).toBeUndefined()
  })

  it('TEST-FE-STF-002 conserva el estado PAID y permite reintentar tras 409', async () => {
    prepararSesion()
    let usos = 0
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () => HttpResponse.json(ticketBase)),
      mockHttp.patch('/api/tickets/TKT-2026-ABC123/use', () => {
        usos += 1
        return respuestaError(409, 'El ticket ya fue utilizado por otra operación.')
      }),
    )
    const user = userEvent.setup()
    renderStaff('/staff/validacion')

    await user.type(await screen.findByRole('textbox', { name: 'Código de ticket' }), 'TKT-2026-ABC123')
    await user.keyboard('{Enter}')
    expect(await screen.findByText('Pagado')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Marcar como usado' }))
    expect(await screen.findByText('Este ticket ya fue usado o no está pagado; no puede volver a utilizarse.')).toBeInTheDocument()
    expect(screen.getByText('Pagado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Marcar como usado' })).toBeEnabled()
    expect(screen.getByRole('textbox', { name: 'Código de ticket' })).toHaveValue('TKT-2026-ABC123')

    await user.click(screen.getByRole('button', { name: 'Marcar como usado' }))
    await waitFor(() => expect(usos).toBe(2))
    expect(screen.getByText('Pagado')).toBeInTheDocument()
  })

  it('TEST-FE-STF-002 retira la acción tras uso exitoso y el cliente API conserva el 409 de un segundo uso', async () => {
    prepararSesion()
    let ticket = { ...ticketBase }
    let usos = 0
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () => HttpResponse.json(ticket)),
      mockHttp.patch('/api/tickets/TKT-2026-ABC123/use', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer staff-token')
        usos += 1
        if (ticket.status === 'USED') return respuestaError(409, 'El ticket ya fue utilizado.')
        ticket = { ...ticket, status: 'USED' }
        return HttpResponse.json(ticket)
      }),
    )
    const user = userEvent.setup()
    renderStaff('/staff/validacion')
    await user.type(await screen.findByRole('textbox', { name: 'Código de ticket' }), ticketBase.ticketCode)
    await user.keyboard('{Enter}')
    await user.click(await screen.findByRole('button', { name: 'Marcar como usado' }))
    expect(await screen.findByText('Usado')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Marcar como usado' })).not.toBeInTheDocument()
    expect(usos).toBe(1)

    // UI correctly removes the action; the repeat request exercises the real client against MSW.
    await expect(marcarTicketUsadoApi(ticketBase.ticketCode, 'staff-token')).rejects.toMatchObject({ status: 409 })
    expect(usos).toBe(2)
    expect(ticket.status).toBe('USED')
    expect(screen.queryByRole('button', { name: 'Marcar como usado' })).not.toBeInTheDocument()
  })

  it.each([403, 404])('TEST-FE-STF-003 no expone datos privados cuando la búsqueda responde %s', async (status) => {
    prepararSesion()
    server.use(
      mockHttp.get('/api/tickets/PRIVATE-CODE', () =>
        respuestaError(status, 'Ticket de ana.private@example.com reservado por Ana.'),
      ),
    )
    const user = userEvent.setup()
    renderStaff('/staff/validacion')

    await user.type(await screen.findByRole('textbox', { name: 'Código de ticket' }), 'PRIVATE-CODE')
    await user.keyboard('{Enter}')

    expect(await screen.findByRole('heading', { name: 'Ticket no disponible' })).toBeInTheDocument()
    expect(screen.queryByText(/ana\.private@example\.com|reservado por Ana/i)).not.toBeInTheDocument()
  })

  it('TEST-FE-STF-004 lista tickets pagados accesiblemente y mantiene el aviso tras retirar un ticket usado', async () => {
    prepararSesion(['ADMIN'])
    let tickets = [{ ...ticketBase }]
    let consultasPagadas = 0
    server.use(
      mockHttp.get('/api/events/CMF-2026/tickets/paid', ({ request }) => {
        consultasPagadas += 1
        expect(request.headers.get('Authorization')).toBe('Bearer staff-token')
        return HttpResponse.json(tickets)
      }),
      mockHttp.get('/api/events/FEST-2026/tickets/paid', () => HttpResponse.json([])),
      mockHttp.patch('/api/tickets/TKT-2026-ABC123/use', () => {
        tickets = []
        return HttpResponse.json({ ...ticketBase, status: 'USED' })
      }),
    )
    const user = userEvent.setup()
    const { router } = renderStaff('/staff/eventos/CMF-2026/tickets')

    const region = await screen.findByRole('region', { name: 'Tickets pagados del evento' })
    const tabla = within(region).getByRole('table')
    expect(within(tabla).getByText('Caribbean Music Fest 2026')).toBeInTheDocument()
    expect(within(tabla).getByText('cliente@example.com')).toBeInTheDocument()
    expect(within(tabla).getByText('TKT-2026-ABC123')).toBeInTheDocument()
    expect(within(tabla).getByText('Pagado')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Usar ticket TKT-2026-ABC123' }))
    expect(await screen.findByRole('status')).toHaveTextContent('TKT-2026-ABC123 marcado como usado.')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    const evento = screen.getByRole('textbox', { name: 'Código de evento' })
    await user.clear(evento)
    await user.type(evento, 'FEST-2026')
    await user.keyboard('{Enter}')

    await waitFor(() => expect(router.state.location.pathname).toBe('/staff/eventos/FEST-2026/tickets'))
    expect(await screen.findByText('Todavía no hay tickets pagados para este evento.')).toBeInTheDocument()
    expect(consultasPagadas).toBeGreaterThanOrEqual(2)
  })

  it('STAFF deja vacía la búsqueda hasta Enter, evita duplicados en vuelo y valida código no vacío', async () => {
    prepararSesion()
    let solicitudes = 0
    let resolverRespuesta: ((respuesta: Response) => void) | undefined
    const respuestaPendiente = new Promise<Response>((resolve) => {
      resolverRespuesta = resolve
    })
    server.use(
      mockHttp.get('/api/tickets/TKT-PENDING', () => {
        solicitudes += 1
        return respuestaPendiente
      }),
    )
    const user = userEvent.setup()
    renderStaff('/staff/validacion')
    const codigo = await screen.findByRole('textbox', { name: 'Código de ticket' })

    await user.keyboard('{Enter}')
    expect(await screen.findByText('Ingresa un código de ticket.')).toBeInTheDocument()
    expect(solicitudes).toBe(0)

    await user.type(codigo, 'TKT-PENDING')
    await user.keyboard('{Enter}{Enter}')
    await waitFor(() => expect(solicitudes).toBe(1))
    expect(solicitudes).toBe(1)
    resolverRespuesta?.(HttpResponse.json({ ...ticketBase, ticketCode: 'TKT-PENDING' }))
    expect(await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' })).toBeInTheDocument()
  })

  it('muestra carga y permite reintentar la lista cuando falla la conexión', async () => {
    prepararSesion()
    let solicitudes = 0
    let responder: ((respuesta: Response) => void) | undefined
    const respuestaPendiente = new Promise<Response>((resolve) => {
      responder = resolve
    })
    server.use(
      mockHttp.get('/api/events/CMF-2026/tickets/paid', () => {
        solicitudes += 1
        return solicitudes === 1 ? respuestaPendiente : HttpResponse.json([])
      }),
    )
    const user = userEvent.setup()
    renderStaff('/staff/eventos/CMF-2026/tickets')

    expect(await screen.findByText('Cargando tickets pagados')).toBeInTheDocument()
    responder?.(respuestaError(500, 'Error interno'))
    expect(await screen.findByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
    expect(screen.getByText('No pudimos cargar los tickets pagados. Inténtalo de nuevo.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('Todavía no hay tickets pagados para este evento.')).toBeInTheDocument()
    expect(solicitudes).toBe(2)
  })

  it('bloquea USER antes de consultar tickets', async () => {
    prepararSesion(['USER'])
    let consultas = 0
    server.use(
      mockHttp.get('/api/events/CMF-2026/tickets/paid', () => {
        consultas += 1
        return HttpResponse.json([])
      }),
    )
    const { router } = renderStaff('/staff/eventos/CMF-2026/tickets')

    expect(await screen.findByText('Sin permisos')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/403')
    expect(consultas).toBe(0)
  })
})
