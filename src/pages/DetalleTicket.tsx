import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Badge from '../componentes/Badge'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import PrecioCOP from '../componentes/PrecioCOP'
import AccionCancelarTicket from '../funcionalidades/tickets/componentes/AccionCancelarTicket'
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

export default function DetalleTicket() {
  const parametros = useParams()
  const { sesion } = useAuth()
  const ticketCode = parametros.ticketCode?.trim() ?? ''
  const consulta = useTicket(ticketCode, Boolean(ticketCode))
  const [mensajeCopiado, setMensajeCopiado] = useState('')

  if (sesion.estado === 'cargando') {
    return <Cargando mensaje="Validando tu sesión" />
  }

  if (sesion.estado === 'anonimo') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoVacio
          titulo="Inicia sesión para consultar tu ticket"
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

  if (!ticketCode) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoVacio
          titulo="Ticket no disponible"
          mensaje="El código del ticket no es válido."
        />
      </div>
    )
  }

  if (consulta.isLoading) {
    return <Cargando mensaje="Cargando ticket" />
  }

  if (consulta.isError) {
    const noDisponible =
      consulta.error instanceof ApiError &&
      (consulta.error.status === 403 || consulta.error.status === 404)

    if (noDisponible) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <EstadoVacio
            titulo="Ticket no disponible"
            mensaje="El ticket no existe o no está disponible para tu cuenta."
          />
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoError
          mensaje="No pudimos cargar el ticket."
          onReintentar={() => void consulta.refetch()}
        />
      </div>
    )
  }

  const ticket = consulta.data
  if (!ticket) return null

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(ticket.ticketCode)
      setMensajeCopiado('Código copiado.')
    } catch {
      setMensajeCopiado('No pudimos copiarlo. Selecciona el código para copiarlo manualmente.')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link
        to={RUTAS.misTickets}
        className="inline-flex min-h-11 items-center rounded-md font-semibold text-marca-700 hover:underline dark:text-marca-400"
      >
        ← Volver a mis tickets
      </Link>

      <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-marca-600 dark:text-marca-300">Detalle del ticket</p>
          <h1 className="font-titulo text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
            {ticket.eventName}
          </h1>
          <Badge tono={tonoEstadoTicket(ticket.status)}>
            {etiquetaEstadoTicket(ticket.status)}
          </Badge>
        </header>

        <section aria-label="Información del ticket" className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Código del ticket
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code className="break-all rounded bg-slate-100 px-3 py-2 font-mono text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                {ticket.ticketCode}
              </code>
              <Boton variante="secundario" onClick={() => void copiarCodigo()}>
                Copiar código
              </Boton>
            </div>
            {mensajeCopiado && (
              <p role="status" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {mensajeCopiado}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ID</p>
            <p className="mt-1 text-slate-900 dark:text-slate-100">{ticket.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Código del evento
            </p>
            <p className="mt-1 break-all text-slate-900 dark:text-slate-100">
              {ticket.eventCode}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Tipo de entrada
            </p>
            <p className="mt-1 text-slate-900 dark:text-slate-100">
              {etiquetaTipoTicket(ticket.type)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Precio</p>
            <p className="mt-1 text-slate-900 dark:text-slate-100">
              <PrecioCOP valor={ticket.price} />
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Fecha de compra
            </p>
            <p className="mt-1 text-slate-900 dark:text-slate-100">
              {formatearFechaCompra(ticket.purchaseDate)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Correo de la cuenta
            </p>
            <p className="mt-1 break-all text-slate-900 dark:text-slate-100">
              {ticket.userEmail}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <AccionCancelarTicket ticket={ticket} />
          <Link
            to={RUTAS.misTickets}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Mis tickets
          </Link>
        </div>
      </article>
    </div>
  )
}
