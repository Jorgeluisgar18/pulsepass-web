import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter, Outlet, useLocation } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../../funcionalidades/auth/AuthContext'
import type { Rol } from '../../../funcionalidades/auth/tipos'
import { server } from '../../mocks/server'
import ConfirmacionCompra from '../../../pages/ConfirmacionCompra'
import DetalleEvento from '../../../pages/DetalleEvento'
import DetalleTicket from '../../../pages/DetalleTicket'
import MisTickets from '../../../pages/MisTickets'

const evento = {
  id: 1,
  eventCode: 'CMF-2026',
  name: 'Caribbean Music Fest 2026',
  description: 'Tres noches de música caribeña.',
  category: 'MUSIC',
  status: 'PUBLISHED',
  eventDate: '2026-12-12T20:00:00',
  minimumAge: 18,
  streamingUrl: null,
  venueCode: 'VEN-SMR-01',
  venueName: 'Marina Convention Center',
  artists: [],
}

const ticketBase = {
  id: 12,
  ticketCode: 'TKT-2026-ABC123',
  type: 'GENERAL',
  price: 125000,
  status: 'PAID',
  purchaseDate: '2026-11-23T18:30:00',
  userEmail: 'ana@example.com',
  eventCode: 'CMF-2026',
  eventName: 'Caribbean Music Fest 2026',
}

function respuestaError(
  status: number,
  message: string,
  details: Record<string, string> = {},
) {
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

function prepararSesion(roles: Rol[] = ['USER']) {
  window.sessionStorage.setItem(
    'pulsepass_sesion',
    JSON.stringify({
      token: 'test-token',
      expiraEn: Date.now() + 60_000,
      usuario: {
        userId: 42,
        username: 'ana',
        email: 'sesion-obsoleta@example.com',
        roles,
      },
    }),
  )

  server.use(
    mockHttp.get('/api/auth/me', ({ request }) => {
      expect(request.headers.get('Authorization')).toBe('Bearer test-token')
      return HttpResponse.json({
        userId: 42,
        username: 'ana',
        email: 'ana@example.com',
        roles,
      })
    }),
  )
}

function CapturaLogin() {
  const location = useLocation()
  return <output aria-label="Estado de navegación">{JSON.stringify(location.state)}</output>
}

function renderAplicacion(rutaInicial: string, gcTime = 0) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime },
      mutations: { retry: false },
    },
  })
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        ),
        children: [
          { path: 'eventos/:eventCode', element: <DetalleEvento /> },
          { path: 'mis-tickets', element: <MisTickets /> },
          { path: 'mis-tickets/:ticketCode', element: <DetalleTicket /> },
          {
            path: 'compra/confirmacion/:ticketCode',
            element: <ConfirmacionCompra />,
          },
          { path: 'login', element: <CapturaLogin /> },
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

  return { router, queryClient }
}

function manejarEvento(status = 'PUBLISHED') {
  server.use(
    mockHttp.get('/api/events/CMF-2026', () =>
      HttpResponse.json({ ...evento, status }),
    ),
  )
}

describe('flujos USER de tickets', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2026, 10, 23, 12))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('TEST-FE-TKT-001 compra con la identidad verificada y TEST-FE-TKT-004 envía el email de sesión', async () => {
    prepararSesion()
    manejarEvento()
    let solicitudCompra: unknown
    let autorizacionCompra: string | null = null
    const tickets = [ticketBase]
    server.use(
      mockHttp.get('/api/tickets/by-user', () => HttpResponse.json(tickets)),
      mockHttp.post('/api/tickets', async ({ request }) => {
        solicitudCompra = await request.json()
        autorizacionCompra = request.headers.get('Authorization')
        tickets[0] = {
          ...ticketBase,
          type: 'VIP',
          status: 'RESERVED',
        }
        return HttpResponse.json(tickets[0], { status: 201 })
      }),
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () =>
        HttpResponse.json(tickets[0]),
      ),
    )

    const user = userEvent.setup()
    const { router, queryClient } = renderAplicacion('/mis-tickets', 60_000)
    expect(await screen.findByRole('heading', { name: 'Mis tickets' })).toBeInTheDocument()
    await router.navigate('/eventos/CMF-2026')

    expect(
      await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' }),
    ).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Tipo de entrada'), 'VIP')
    await user.click(screen.getAllByRole('button', { name: 'Comprar entrada' })[0]!)

    expect(await screen.findByRole('dialog', { name: 'Confirmar compra' })).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByText('VIP')).toBeInTheDocument()
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
    expect(screen.queryByText(/125/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    expect(
      await screen.findByRole('heading', { name: 'Compra confirmada' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('TKT-2026-ABC123')).toBeInTheDocument()
    expect(solicitudCompra).toEqual({
      userEmail: 'ana@example.com',
      eventCode: 'CMF-2026',
      type: 'VIP',
    })
    expect(autorizacionCompra).toBe('Bearer test-token')
    const consultaTickets = queryClient
      .getQueryCache()
      .findAll({ queryKey: ['tickets'] })
      .find((consulta) => consulta.queryKey[1] === 'usuario')
    expect(consultaTickets?.state.isInvalidated).toBe(true)
    queryClient.clear()
  })

  it('TEST-FE-TKT-002 conserva el regreso al evento cuando un visitante elige comprar', async () => {
    manejarEvento()
    const user = userEvent.setup()
    renderAplicacion('/eventos/CMF-2026')

    const enlace = await screen.findAllByRole('link', {
      name: 'Inicia sesión para comprar',
    })
    await user.click(enlace[0]!)

    expect(await screen.findByLabelText('Estado de navegación')).toHaveTextContent(
      '"desde":"/eventos/CMF-2026"',
    )
  })

  it('extra: mantiene la compra oculta para roles de operación', async () => {
    prepararSesion(['USER', 'STAFF'])
    manejarEvento()
    renderAplicacion('/eventos/CMF-2026')

    expect(
      await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Entradas' })).not.toBeInTheDocument()
  })

  it('extra: deshabilita la compra cuando el evento no está publicado', async () => {
    manejarEvento('DRAFT')
    renderAplicacion('/eventos/CMF-2026')
    const botones = await screen.findAllByRole('button', {
      name: 'Compra no disponible',
    })
    expect(botones).toHaveLength(2)
    botones.forEach((boton) => expect(boton).toBeDisabled())
  })

  it('TEST-FE-TKT-005 lista los tickets propios y filtra por estado', async () => {
    prepararSesion()
    const tickets = [
      { ...ticketBase, ticketCode: 'PAID-1', eventName: 'Festival pagado', status: 'PAID' },
      { ...ticketBase, id: 13, ticketCode: 'USED-1', eventName: 'Festival usado', status: 'USED' },
      { ...ticketBase, id: 14, ticketCode: 'CANCELLED-1', eventName: 'Festival cancelado', status: 'CANCELLED' },
      { ...ticketBase, id: 15, ticketCode: 'RESERVED-1', eventName: 'Festival reservado', status: 'RESERVED' },
    ]
    let emailConsulta = ''
    server.use(
      mockHttp.get('/api/tickets/by-user', ({ request }) => {
        emailConsulta = new URL(request.url).searchParams.get('email') ?? ''
        return HttpResponse.json(tickets)
      }),
    )
    const user = userEvent.setup()
    renderAplicacion('/mis-tickets')

    expect(await screen.findByText('Festival pagado')).toBeInTheDocument()
    expect(screen.getByText('Festival usado')).toBeInTheDocument()
    expect(screen.getByText('Festival cancelado')).toBeInTheDocument()
    expect(screen.getByText('Festival reservado')).toBeInTheDocument()
    expect(emailConsulta).toBe('ana@example.com')
    expect(screen.getAllByText(/125\.000/)).toHaveLength(4)

    await user.click(screen.getByRole('button', { name: 'Pagados' }))
    expect(screen.getByText('Festival pagado')).toBeInTheDocument()
    expect(screen.queryByText('Festival usado')).not.toBeInTheDocument()
    expect(screen.queryByText('Festival cancelado')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Usados' }))
    expect(screen.getByText('Festival usado')).toBeInTheDocument()
    expect(screen.queryByText('Festival pagado')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancelados' }))
    expect(screen.getByText('Festival cancelado')).toBeInTheDocument()
    expect(screen.queryByText('Festival reservado')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('Festival reservado')).toBeInTheDocument()
  })

  it('extra: muestra el ticket completo y ofrece copiar el código', async () => {
    prepararSesion()
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () =>
        HttpResponse.json(ticketBase),
      ),
    )
    const user = userEvent.setup()
    const copiar = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: copiar },
    })
    renderAplicacion('/mis-tickets/TKT-2026-ABC123')

    expect(await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' })).toBeInTheDocument()
    expect(screen.getByText('TKT-2026-ABC123')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Pagado')).toBeInTheDocument()
    expect(screen.getByText(/125\.000/)).toBeInTheDocument()
    expect(screen.getByText(/23\/11\/2026/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Copiar código' }))
    expect(copiar).toHaveBeenCalledWith('TKT-2026-ABC123')
    expect(await screen.findByText('Código copiado.')).toBeInTheDocument()
  })

  it('TEST-FE-TKT-007 cancela un ticket PAID y actualiza la lista', async () => {
    prepararSesion()
    manejarEvento()
    let ticket = { ...ticketBase }
    server.use(
      mockHttp.get('/api/tickets/by-user', () => HttpResponse.json([ticket])),
      mockHttp.patch('/api/tickets/TKT-2026-ABC123/cancel', () => {
        ticket = { ...ticket, status: 'CANCELLED' }
        return HttpResponse.json(ticket)
      }),
    )
    const user = userEvent.setup()
    renderAplicacion('/mis-tickets')

    expect(await screen.findByText('Caribbean Music Fest 2026')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancelar ticket TKT-2026-ABC123' }))
    expect(await screen.findByRole('dialog', { name: 'Cancelar ticket' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirmar cancelación' }))

    expect(await screen.findByText('Cancelado')).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Cancelar ticket' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cancelar ticket TKT-2026-ABC123' }),
    ).not.toBeInTheDocument()
  })

  it.each(['RESERVED', 'USED', 'CANCELLED'] as const)('TEST-FE-TKT-010 no muestra Cancelar para tickets %s en listado y detalle', async (status) => {
    prepararSesion()
    const ticket = { ...ticketBase, status }
    server.use(
      mockHttp.get('/api/tickets/by-user', () => HttpResponse.json([ticket])),
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () => HttpResponse.json(ticket)),
    )
    const { router } = renderAplicacion('/mis-tickets')

    expect(await screen.findByText('Caribbean Music Fest 2026')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar ticket TKT-2026-ABC123' })).not.toBeInTheDocument()

    await router.navigate('/mis-tickets/TKT-2026-ABC123')
    expect(await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar ticket TKT-2026-ABC123' })).not.toBeInTheDocument()
  })

  it('TEST-FE-TKT-008 conserva la confirmación y el mensaje del backend ante 409 al cancelar', async () => {
    prepararSesion()
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () => HttpResponse.json(ticketBase)),
      mockHttp.patch('/api/tickets/TKT-2026-ABC123/cancel', () =>
        respuestaError(409, 'El ticket ya fue validado y no puede cancelarse.'),
      ),
    )
    const user = userEvent.setup()
    renderAplicacion('/mis-tickets/TKT-2026-ABC123')

    expect(await screen.findByRole('heading', { name: 'Caribbean Music Fest 2026' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancelar ticket TKT-2026-ABC123' }))
    await user.click(await screen.findByRole('button', { name: 'Confirmar cancelación' }))

    expect(await screen.findByText('El ticket ya fue validado y no puede cancelarse.')).toBeInTheDocument()
    const dialogo = screen.getByRole('dialog', { name: 'Cancelar ticket' })
    expect(dialogo).toBeInTheDocument()
    expect(within(dialogo).getByRole('alert')).toHaveTextContent(
      'El ticket ya fue validado y no puede cancelarse.',
    )
  })

  it.each([
    [400, 'El tipo seleccionado no es válido.', 'El tipo seleccionado no es válido.'],
    [403, 'La compra no está permitida.', 'No tienes permisos para comprar entradas.'],
    [409, 'El evento agotó este tipo de entrada.', 'El evento agotó este tipo de entrada.'],
  ])('TEST-FE-TKT-003 conserva el modal y explica el error de compra %s', async (status, backendMessage, expectedMessage) => {
    prepararSesion()
    manejarEvento()
    server.use(
      mockHttp.post('/api/tickets', () => respuestaError(status, backendMessage)),
    )
    const user = userEvent.setup()
    renderAplicacion('/eventos/CMF-2026')

    await user.click((await screen.findAllByRole('button', { name: 'Comprar entrada' }))[0]!)
    await user.click(await screen.findByRole('button', { name: 'Confirmar compra' }))

    expect(await screen.findByText(expectedMessage)).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Confirmar compra' })).toBeInTheDocument()
  })

  it('TEST-FE-TKT-006 presenta estados de carga, error reintentable y lista vacía', async () => {
    prepararSesion()
    let responder: ((response: Response) => void) | undefined
    const respuestaPendiente = new Promise<Response>((resolve) => {
      responder = resolve
    })
    server.use(
      mockHttp.get('/api/tickets/by-user', async () => respuestaPendiente),
    )
    const user = userEvent.setup()
    renderAplicacion('/mis-tickets')

    expect(await screen.findByText('Cargando tus tickets')).toBeInTheDocument()
    responder?.(respuestaError(500, 'Error interno'))
    expect(await screen.findByRole('button', { name: 'Reintentar' })).toBeInTheDocument()

    let intentos = 0
    server.use(
      mockHttp.get('/api/tickets/by-user', () => {
        intentos += 1
        return HttpResponse.json([])
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText('No tienes tickets todavía.')).toBeInTheDocument()
    await waitFor(() => expect(intentos).toBeGreaterThan(0))
  })

  it.each([403, 404])('TEST-FE-TKT-009 no revela datos ajenos cuando el ticket responde %s', async (status) => {
    prepararSesion()
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () =>
        respuestaError(status, 'Ticket de otra persona: ana.private@example.com'),
      ),
    )
    renderAplicacion('/mis-tickets/TKT-2026-ABC123')

    expect(await screen.findByRole('heading', { name: 'Ticket no disponible' })).toBeInTheDocument()
    expect(screen.queryByText(/otra persona/i)).not.toBeInTheDocument()
    expect(screen.queryByText('ana.private@example.com')).not.toBeInTheDocument()
  })

  it.each([403, 404])('extra: oculta datos privados en la confirmación ante %s', async (status) => {
    prepararSesion()
    server.use(
      mockHttp.get('/api/tickets/TKT-2026-ABC123', () =>
        respuestaError(status, 'Ticket privado de ana.private@example.com'),
      ),
    )
    renderAplicacion('/compra/confirmacion/TKT-2026-ABC123')

    expect(await screen.findByRole('heading', { name: 'Compra no disponible' })).toBeInTheDocument()
    expect(screen.getByText('El ticket no existe o no está disponible para tu cuenta.')).toBeInTheDocument()
    expect(screen.queryByText(/Ticket privado/i)).not.toBeInTheDocument()
    expect(screen.queryByText('ana.private@example.com')).not.toBeInTheDocument()
  })
})
