import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp, type JsonBodyType } from 'msw'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import AdminCrearEvento from '../../pages/AdminCrearEvento'
import AdminEventos from '../../pages/AdminEventos'
import CatalogoEventos from '../../pages/CatalogoEventos'
import ConfirmacionCompra from '../../pages/ConfirmacionCompra'
import DetalleTicket from '../../pages/DetalleTicket'
import AdminGestionEvento from '../../pages/AdminGestionEvento'
import Cuenta from '../../pages/Cuenta'
import TicketsPagadosEvento from '../../pages/TicketsPagadosEvento'
import type { Rol } from '../../funcionalidades/auth/tipos'
import DetalleArtista from '../../pages/DetalleArtista'
import DetalleEvento from '../../pages/DetalleEvento'
import DetalleSede from '../../pages/DetalleSede'
import Inicio from '../../pages/Inicio'
import ListaArtistas from '../../pages/ListaArtistas'
import ListaSedes from '../../pages/ListaSedes'
import { server } from '../mocks/server'
import { renderConRouter } from '../utils/renderConRouter'

const artista = { id: 1, stageName: 'Solar Beat', country: 'Colombia', genre: 'Electronic', active: true }
const sede = { id: 1, code: 'VEN-SMR-01', name: 'Marina Convention Center', city: 'Santa Marta', address: 'Calle 1', capacity: 500, active: true }
const evento = {
  id: 1, eventCode: 'CMF-2026', name: 'Caribbean Music Fest 2026', description: 'Festival del Caribe.',
  category: 'MUSIC', status: 'PUBLISHED', eventDate: '2026-12-12T20:00:00', minimumAge: 18,
  streamingUrl: null, venueCode: sede.code, venueName: sede.name, artists: [artista],
}

const ticket = { id: 12, ticketCode: 'TKT-2026-ABC123', type: 'GENERAL', price: 125000, status: 'PAID', purchaseDate: '2026-11-23T12:00:00', userEmail: 'ana@example.com', eventCode: evento.eventCode, eventName: evento.name }

interface CasoEstado {
  pagina: string
  componente: ReactElement
  ruta: string
  entrada: string
  endpoint: string
  cargando: string
  error: string
  recuperado: string
  respuesta: JsonBodyType
  rol?: Rol
}

const casos: CasoEstado[] = [
  { pagina: 'CatalogoEventos', componente: <CatalogoEventos />, ruta: '/eventos', entrada: '/eventos', endpoint: '/api/events/published', cargando: 'Cargando cartelera', error: 'No pudimos cargar la cartelera.', recuperado: evento.name, respuesta: [evento] },
  { pagina: 'DetalleTicket', componente: <DetalleTicket />, ruta: '/mis-tickets/:ticketCode', entrada: '/mis-tickets/TKT-2026-ABC123', endpoint: '/api/tickets/TKT-2026-ABC123', cargando: 'Cargando ticket', error: 'No pudimos cargar el ticket.', recuperado: evento.name, respuesta: ticket, rol: 'USER' },
  { pagina: 'ConfirmacionCompra', componente: <ConfirmacionCompra />, ruta: '/compra/confirmacion/:ticketCode', entrada: '/compra/confirmacion/TKT-2026-ABC123', endpoint: '/api/tickets/TKT-2026-ABC123', cargando: 'Cargando confirmación de compra', error: 'No pudimos cargar la confirmación de compra.', recuperado: 'Compra confirmada', respuesta: ticket, rol: 'USER' },
  { pagina: 'Cuenta', componente: <Cuenta />, ruta: '/cuenta', entrada: '/cuenta', endpoint: '/api/users/by-email', cargando: 'Cargando información de tu cuenta…', error: 'No pudimos cargar la información de tu cuenta.', recuperado: 'Ana Garcia', respuesta: { id: 42, username: 'ana', email: 'ana@example.com', active: true, firstName: 'Ana', lastName: 'Garcia', birthDate: '2000-01-01' }, rol: 'USER' },
  { pagina: 'AdminCrearEvento', componente: <AdminCrearEvento />, ruta: '/admin/eventos/nuevo', entrada: '/admin/eventos/nuevo', endpoint: '/api/venues/active', cargando: 'Cargando sedes activas…', error: 'Ocurrió un error inesperado. Inténtalo más tarde.', recuperado: 'No hay sedes activas disponibles.', respuesta: [], rol: 'ADMIN' },
  { pagina: 'AdminGestionEvento', componente: <AdminGestionEvento />, ruta: '/admin/eventos/:eventCode', entrada: '/admin/eventos/CMF-2026', endpoint: '/api/events/CMF-2026', cargando: 'Cargando información privada del evento…', error: 'Ocurrió un error inesperado. Inténtalo más tarde.', recuperado: evento.name, respuesta: evento, rol: 'ADMIN' },
  { pagina: 'Artistas activos de AdminGestionEvento', componente: <AdminGestionEvento />, ruta: '/admin/eventos/:eventCode', entrada: '/admin/eventos/CMF-2026', endpoint: '/api/artists/active', cargando: 'Cargando artistas activos…', error: 'Ocurrió un error inesperado. Inténtalo más tarde.', recuperado: 'No hay artistas activos disponibles.', respuesta: [], rol: 'ADMIN' },
  { pagina: 'TicketsPagadosEvento', componente: <TicketsPagadosEvento />, ruta: '/staff/eventos/:eventCode/tickets', entrada: '/staff/eventos/CMF-2026/tickets', endpoint: '/api/events/CMF-2026/tickets/paid', cargando: 'Cargando tickets pagados', error: 'No pudimos cargar los tickets pagados. Inténtalo de nuevo.', recuperado: 'Sin tickets pagados', respuesta: [], rol: 'STAFF' },
  { pagina: 'ListaArtistas', componente: <ListaArtistas />, ruta: '/artistas', entrada: '/artistas', endpoint: '/api/artists/active', cargando: 'Cargando artistas', error: 'No pudimos cargar los artistas.', recuperado: 'Aún no hay artistas disponibles', respuesta: [] },
  { pagina: 'ListaSedes', componente: <ListaSedes />, ruta: '/sedes', entrada: '/sedes', endpoint: '/api/venues/active', cargando: 'Cargando sedes', error: 'No pudimos cargar las sedes.', recuperado: sede.name, respuesta: [sede] },
  { pagina: 'DetalleSede', componente: <DetalleSede />, ruta: '/sedes/:code', entrada: '/sedes/VEN-SMR-01', endpoint: '/api/venues/VEN-SMR-01', cargando: 'Cargando sede', error: 'No pudimos cargar la sede.', recuperado: sede.name, respuesta: sede },
  { pagina: 'DetalleArtista', componente: <DetalleArtista />, ruta: '/artistas/:id', entrada: '/artistas/1', endpoint: '/api/artists/1', cargando: 'Cargando artista', error: 'No pudimos cargar el artista.', recuperado: artista.stageName, respuesta: artista },
  { pagina: 'Inicio', componente: <Inicio />, ruta: '/', entrada: '/', endpoint: '/api/events/published', cargando: 'Cargando eventos y artistas', error: 'No pudimos cargar el contenido de inicio.', recuperado: evento.name, respuesta: [evento] },
  { pagina: 'DetalleEvento', componente: <DetalleEvento />, ruta: '/eventos/:eventCode', entrada: '/eventos/CMF-2026', endpoint: '/api/events/CMF-2026', cargando: 'Cargando detalle del evento', error: 'No pudimos cargar el evento.', recuperado: evento.name, respuesta: evento },
]

function errorServidor() {
  return HttpResponse.json({ timestamp: '2026-11-23T12:00:00', status: 500, error: 'Internal Server Error', message: 'Unexpected error', details: {} }, { status: 500 })
}

describe('QT-FE-001 estados de datos y recuperación', () => {
  it.each(casos)('$pagina anuncia carga, presenta error y se recupera al reintentar', async (caso) => {
    let responder: (respuesta: Response) => void = () => { throw new Error('Pending response not initialized') }
    const pendiente = new Promise<Response>((resolve) => { responder = resolve })
    let solicitudes = 0
    if (caso.rol) {
      const usuario = { userId: 42, username: 'ana', email: 'ana@example.com', roles: [caso.rol] }
      window.sessionStorage.setItem('pulsepass_sesion', JSON.stringify({ token: 'states-token', expiraEn: Date.now() + 60_000, usuario }))
      server.use(mockHttp.get('/api/auth/me', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer states-token')
        return HttpResponse.json(usuario)
      }))
    }
    server.use(
      mockHttp.get('/api/events/CMF-2026', () => HttpResponse.json(evento)),
      mockHttp.get('/api/artists/active', () => HttpResponse.json([artista])),
      mockHttp.get('/api/events/by-artist', () => HttpResponse.json([])),
    )
    server.use(
      mockHttp.get(caso.endpoint, () => {
        solicitudes += 1
        return solicitudes === 1 ? pendiente : HttpResponse.json(caso.respuesta)
      }),
    )
    const user = userEvent.setup()
    renderConRouter(caso.componente, { ruta: caso.ruta, rutaInicial: caso.entrada })

    const carga = await screen.findByText(caso.cargando)
    expect(carga.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText(caso.error)).not.toBeInTheDocument()
    responder(errorServidor())
    expect(await screen.findByText(caso.error)).toBeInTheDocument()
    expect(screen.queryByText(caso.cargando)).not.toBeInTheDocument()
    expect(solicitudes).toBe(1)

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { name: caso.recuperado })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(caso.error)).not.toBeInTheDocument())
    expect(solicitudes).toBe(2)
  })

  it('AdminEventos busca bajo demanda, anuncia carga y permite reintentar tras error', async () => {
    const usuario = { userId: 42, username: 'ana', email: 'ana@example.com', roles: ['ADMIN'] }
    window.sessionStorage.setItem('pulsepass_sesion', JSON.stringify({ token: 'states-token', expiraEn: Date.now() + 60_000, usuario }))
    let responder: (respuesta: Response) => void = () => { throw new Error('Pending response not initialized') }
    const pendiente = new Promise<Response>((resolve) => { responder = resolve })
    let solicitudes = 0
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
      mockHttp.get('/api/events/CMF-2026', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe('Bearer states-token')
        solicitudes += 1
        return solicitudes === 1 ? pendiente : HttpResponse.json(evento)
      }),
    )
    const user = userEvent.setup()
    renderConRouter(<AdminEventos />, { ruta: '/admin/eventos', rutaInicial: '/admin/eventos' })
    expect(await screen.findByText('Todavía no has creado eventos en esta sesión.')).toBeInTheDocument()
    expect(solicitudes).toBe(0)
    await user.type(screen.getByRole('textbox', { name: 'Código del evento' }), evento.eventCode)
    await user.click(screen.getByRole('button', { name: 'Buscar evento' }))
    expect(await screen.findByText('Buscando evento…')).toHaveAttribute('role', 'status')
    expect(screen.getByRole('button', { name: 'Cargando…' })).toHaveAttribute('aria-busy', 'true')
    responder(errorServidor())
    expect(await screen.findByText('Ocurrió un error inesperado. Inténtalo más tarde.')).toBeInTheDocument()
    expect(solicitudes).toBe(1)
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { name: evento.name })).toBeInTheDocument()
    expect(screen.queryByText('Ocurrió un error inesperado. Inténtalo más tarde.')).not.toBeInTheDocument()
    expect(solicitudes).toBe(2)
  })

  it('DetalleArtista recupera sus eventos asociados y muestra vacío tras reintentar', async () => {
    let responder: (respuesta: Response) => void = () => { throw new Error('Pending response not initialized') }
    const pendiente = new Promise<Response>((resolve) => { responder = resolve })
    let solicitudes = 0
    server.use(
      mockHttp.get('/api/artists/1', () => HttpResponse.json(artista)),
      mockHttp.get('/api/events/by-artist', ({ request }) => {
        expect(new URL(request.url).searchParams.get('stageName')).toBe(artista.stageName)
        solicitudes += 1
        return solicitudes === 1 ? pendiente : HttpResponse.json([])
      }),
    )
    const user = userEvent.setup()
    renderConRouter(<DetalleArtista />, { ruta: '/artistas/:id', rutaInicial: '/artistas/1' })
    expect(await screen.findByRole('heading', { name: artista.stageName })).toBeInTheDocument()
    expect(await screen.findByText('Cargando próximos eventos')).toBeInTheDocument()
    responder(errorServidor())
    expect(await screen.findByText('No pudimos cargar los próximos eventos.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { name: 'Sin eventos próximos' })).toBeInTheDocument()
    expect(screen.queryByText('No pudimos cargar los próximos eventos.')).not.toBeInTheDocument()
    expect(solicitudes).toBe(2)
  })
})
