import { Link, useParams } from 'react-router'
import Badge from '../componentes/Badge'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import PrecioCOP from '../componentes/PrecioCOP'
import {
  etiquetaEstadoTicket,
  etiquetaTipoTicket,
  formatearFechaCompra,
  tonoEstadoTicket,
} from '../funcionalidades/tickets/formato'
import { useTicket } from '../funcionalidades/tickets/hooks'
import { useAuth } from '../funcionalidades/auth/hooks'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'

export default function ConfirmacionCompra() {
  const parametros = useParams()
  const { sesion } = useAuth()
  const ticketCode = parametros.ticketCode?.trim() ?? ''
  const consulta = useTicket(ticketCode, Boolean(ticketCode))

  if (sesion.estado === 'cargando') {
    return <Cargando mensaje="Validando tu sesión" />
  }

  if (sesion.estado === 'anonimo') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <EstadoVacio
          titulo="Inicia sesión para consultar la compra"
          mensaje="La confirmación de compra está asociada a tu cuenta."
          accion={
            <Link
              to={RUTAS.login}
              className="inline-flex min-h-11 items-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white hover:bg-marca-700"
            >
              Iniciar sesión
            </Link>
          }
        />
      </div>
    )
  }

  if (!ticketCode) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <EstadoVacio
          titulo="Compra no disponible"
          mensaje="No encontramos un código de ticket válido."
        />
      </div>
    )
  }

  if (consulta.isLoading) {
    return <Cargando mensaje="Cargando confirmación de compra" />
  }

  if (consulta.isError) {
    const noDisponible =
      consulta.error instanceof ApiError &&
      (consulta.error.status === 403 || consulta.error.status === 404)

    if (noDisponible) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <EstadoVacio
            titulo="Compra no disponible"
            mensaje="El ticket no existe o no está disponible para tu cuenta."
          />
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <EstadoError
          mensaje="No pudimos cargar la confirmación de compra."
          onReintentar={() => void consulta.refetch()}
        />
      </div>
    )
  }

  const ticket = consulta.data
  if (!ticket) return null

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <section className="space-y-6 rounded-xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-7 dark:border-emerald-900 dark:bg-slate-900">
        <header>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            PulsePass
          </p>
          <h1 className="font-titulo mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            Compra confirmada
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Guarda el código de tu entrada para consultarla más tarde.
          </p>
        </header>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Evento
            </dt>
            <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {ticket.eventName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Tipo de entrada
            </dt>
            <dd className="mt-1 text-slate-900 dark:text-slate-100">
              {etiquetaTipoTicket(ticket.type)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Precio
            </dt>
            <dd className="mt-1 text-slate-900 dark:text-slate-100">
              <PrecioCOP valor={ticket.price} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Fecha de compra
            </dt>
            <dd className="mt-1 text-slate-900 dark:text-slate-100">
              {formatearFechaCompra(ticket.purchaseDate)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Estado
            </dt>
            <dd className="mt-1">
              <Badge tono={tonoEstadoTicket(ticket.status)}>
                {etiquetaEstadoTicket(ticket.status)}
              </Badge>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Código del ticket
            </dt>
            <dd className="mt-1 break-all font-mono text-slate-900 dark:text-slate-100">
              {ticket.ticketCode}
            </dd>
          </div>
        </dl>

        <nav className="flex flex-col gap-3 sm:flex-row" aria-label="Acciones de compra">
          <Link
            to={RUTAS.misTickets}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white hover:bg-marca-700"
          >
            Mis tickets
          </Link>
          <Link
            to={RUTAS.eventos}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Volver a la cartelera
          </Link>
          <span className="sr-only">Compra registrada el {formatearFechaCompra(ticket.purchaseDate)}</span>
        </nav>
      </section>
    </div>
  )
}
