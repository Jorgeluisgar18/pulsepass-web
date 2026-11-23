import { useState } from 'react'
import { Link } from 'react-router'
import Badge from '../componentes/Badge'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import PrecioCOP from '../componentes/PrecioCOP'
import Tabla from '../componentes/Tabla'
import type { ColumnaTabla } from '../componentes/Tabla'
import AccionCancelarTicket from '../funcionalidades/tickets/componentes/AccionCancelarTicket'
import {
  etiquetaEstadoTicket,
  etiquetaTipoTicket,
  formatearFechaCompra,
  tonoEstadoTicket,
} from '../funcionalidades/tickets/formato'
import { useTicketsUsuario } from '../funcionalidades/tickets/hooks'
import type { EstadoTicket, TicketResponse } from '../funcionalidades/tickets/tipos'
import { useAuth } from '../funcionalidades/auth/hooks'
import { RUTAS } from '../lib/rutas'

type FiltroTickets =
  | 'TODOS'
  | Extract<EstadoTicket, 'PAID' | 'USED' | 'CANCELLED'>

const filtros: { valor: FiltroTickets; etiqueta: string }[] = [
  { valor: 'TODOS', etiqueta: 'Todos' },
  { valor: 'PAID', etiqueta: 'Pagados' },
  { valor: 'USED', etiqueta: 'Usados' },
  { valor: 'CANCELLED', etiqueta: 'Cancelados' },
]

function obtenerColumnas(): ColumnaTabla<TicketResponse>[] {
  return [
    {
      encabezado: 'Código',
      celda: (ticket) => (
        <Link
          className="font-semibold text-marca-700 underline-offset-4 hover:underline dark:text-marca-400"
          to={RUTAS.ticket(ticket.ticketCode)}
        >
          {ticket.ticketCode}
        </Link>
      ),
    },
    { encabezado: 'Evento', celda: (ticket) => ticket.eventName },
    {
      encabezado: 'Tipo',
      celda: (ticket) => etiquetaTipoTicket(ticket.type),
    },
    {
      encabezado: 'Precio',
      celda: (ticket) => <PrecioCOP valor={ticket.price} />,
    },
    {
      encabezado: 'Fecha de compra',
      celda: (ticket) => formatearFechaCompra(ticket.purchaseDate),
    },
    {
      encabezado: 'Estado',
      celda: (ticket) => (
        <Badge tono={tonoEstadoTicket(ticket.status)}>
          {etiquetaEstadoTicket(ticket.status)}
        </Badge>
      ),
    },
    {
      encabezado: 'Acciones',
      celda: (ticket) =>
        ticket.status === 'PAID' ? (
          <AccionCancelarTicket ticket={ticket} />
        ) : (
          <span aria-label="Sin acciones disponibles">—</span>
        ),
    },
  ]
}

export default function MisTickets() {
  const { sesion } = useAuth()
  const consulta = useTicketsUsuario()
  const [filtro, setFiltro] = useState<FiltroTickets>('TODOS')

  if (sesion.estado === 'cargando') {
    return <Cargando mensaje="Cargando tu sesión" />
  }

  if (sesion.estado === 'anonimo') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoVacio
          titulo="Inicia sesión para ver tus tickets"
          mensaje="Tus tickets están asociados a tu cuenta."
          accion={
            <Link
              className="inline-flex min-h-11 items-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white hover:bg-marca-700"
              to={RUTAS.login}
            >
              Iniciar sesión
            </Link>
          }
        />
      </div>
    )
  }

  if (consulta.isLoading) {
    return <Cargando mensaje="Cargando tus tickets" />
  }

  if (consulta.isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoError
          mensaje="No pudimos cargar tus tickets."
          onReintentar={() => void consulta.refetch()}
        />
      </div>
    )
  }

  const tickets = consulta.data ?? []
  const ticketsVisibles = tickets.filter(
    (ticket) => filtro === 'TODOS' || ticket.status === filtro,
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-marca-600">PulsePass</p>
        <h1 className="font-titulo mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Mis tickets
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Consulta tus entradas y el estado de cada compra.
        </p>
      </header>

      {tickets.length === 0 ? (
        <EstadoVacio
          titulo="No tienes tickets todavía."
          mensaje="Cuando compres una entrada, aparecerá aquí."
          accion={
            <Link
              to={RUTAS.eventos}
              className="inline-flex min-h-11 items-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white hover:bg-marca-700"
            >
              Ver cartelera
            </Link>
          }
        />
      ) : (
        <>
          <nav className="flex flex-wrap gap-2" aria-label="Filtros de tickets">
            {filtros.map((opcion) => (
              <Boton
                key={opcion.valor}
                variante={filtro === opcion.valor ? 'primario' : 'secundario'}
                aria-pressed={filtro === opcion.valor}
                onClick={() => setFiltro(opcion.valor)}
              >
                {opcion.etiqueta}
              </Boton>
            ))}
          </nav>

          {ticketsVisibles.length === 0 ? (
            <EstadoVacio
              titulo="No hay tickets con este estado."
              mensaje="Prueba otro filtro para consultar tus entradas."
            />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Tabla
                columnas={obtenerColumnas()}
                filas={ticketsVisibles}
                obtenerClave={(ticket) => ticket.id}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
