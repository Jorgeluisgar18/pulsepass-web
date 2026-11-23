import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import Badge from '../componentes/Badge'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import Campo from '../componentes/Campo'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import PrecioCOP from '../componentes/PrecioCOP'
import Tabla from '../componentes/Tabla'
import AccionUsarTicket from '../funcionalidades/tickets/componentes/AccionUsarTicket'
import {
  useTicketsPagadosEvento,
} from '../funcionalidades/tickets/hooks'
import {
  etiquetaEstadoTicket,
  etiquetaTipoTicket,
  formatearFechaCompra,
  tonoEstadoTicket,
} from '../funcionalidades/tickets/formato'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'

const formularioEventoSchema = z.object({
  eventCode: z.string().trim().min(1, 'Ingresa un código de evento.'),
})

type FormularioEvento = z.infer<typeof formularioEventoSchema>

function mensajeErrorLista(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return 'No tienes permisos para consultar los tickets pagados de este evento.'
    }

    if (error.status === 401) {
      return 'Tu sesión ya no está activa. Inicia sesión nuevamente.'
    }

    if (error.tipo === 'red') {
      return 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
    }
  }

  return 'No pudimos cargar los tickets pagados. Inténtalo de nuevo.'
}

function columnasTickets(
  alUsar: (ticket: TicketResponse) => void,
) {
  return [
    {
      encabezado: 'Código',
      celda: (ticket: TicketResponse) => (
        <span className="font-mono font-semibold">{ticket.ticketCode}</span>
      ),
    },
    {
      encabezado: 'Evento',
      celda: (ticket: TicketResponse) => (
        <span>
          <span className="block font-medium">{ticket.eventName}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{ticket.eventCode}</span>
        </span>
      ),
    },
    {
      encabezado: 'Titular',
      celda: (ticket: TicketResponse) => ticket.userEmail,
    },
    {
      encabezado: 'Tipo',
      celda: (ticket: TicketResponse) => etiquetaTipoTicket(ticket.type),
    },
    {
      encabezado: 'Precio',
      celda: (ticket: TicketResponse) => <PrecioCOP valor={ticket.price} />,
    },
    {
      encabezado: 'Fecha de compra',
      celda: (ticket: TicketResponse) => formatearFechaCompra(ticket.purchaseDate),
    },
    {
      encabezado: 'Estado',
      celda: (ticket: TicketResponse) => (
        <Badge tono={tonoEstadoTicket(ticket.status)}>
          {etiquetaEstadoTicket(ticket.status)}
        </Badge>
      ),
    },
    {
      encabezado: 'Acción',
      celda: (ticket: TicketResponse) => (
        <AccionUsarTicket
          ticket={ticket}
          textoBoton={`Usar ticket ${ticket.ticketCode}`}
          alUsar={alUsar}
        />
      ),
    },
  ]
}

function TarjetaTicket({
  ticket,
  alUsar,
}: {
  ticket: TicketResponse
  alUsar: (ticket: TicketResponse) => void
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold">{ticket.eventName}</h3>
          <p className="mt-1 break-all font-mono text-sm">{ticket.ticketCode}</p>
        </div>
        <Badge tono={tonoEstadoTicket(ticket.status)}>
          {etiquetaEstadoTicket(ticket.status)}
        </Badge>
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Código de evento</dt>
          <dd className="mt-0.5">{ticket.eventCode}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Correo del titular</dt>
          <dd className="mt-0.5 break-all">{ticket.userEmail}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Tipo</dt>
            <dd className="mt-0.5">{etiquetaTipoTicket(ticket.type)}</dd>
          </div>
          <div className="text-right">
            <dt className="text-slate-500 dark:text-slate-400">Precio</dt>
            <dd className="mt-0.5"><PrecioCOP valor={ticket.price} /></dd>
          </div>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Fecha de compra</dt>
          <dd className="mt-0.5">{formatearFechaCompra(ticket.purchaseDate)}</dd>
        </div>
      </dl>
      {ticket.status === 'PAID' && (
        <div className="mt-4">
          <AccionUsarTicket
            ticket={ticket}
            textoBoton={`Marcar como usado ${ticket.ticketCode}`}
            alUsar={alUsar}
          />
        </div>
      )}
    </article>
  )
}

export default function TicketsPagadosEvento() {
  const { eventCode: codigoRuta = '' } = useParams()
  const navigate = useNavigate()
  const [mensajeExito, setMensajeExito] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioEvento>({
    resolver: zodResolver(formularioEventoSchema),
    defaultValues: { eventCode: codigoRuta },
    mode: 'onSubmit',
  })
  const consulta = useTicketsPagadosEvento(codigoRuta)

  useEffect(() => {
    reset({ eventCode: codigoRuta })
  }, [codigoRuta, reset])

  function cambiarEvento({ eventCode }: FormularioEvento) {
    setMensajeExito('')
    if (eventCode === codigoRuta) {
      void consulta.refetch()
      return
    }

    navigate(RUTAS.staffTicketsEvento(eventCode))
  }

  function manejarTicketUsado(ticket: TicketResponse) {
    setMensajeExito(`${ticket.ticketCode} marcado como usado.`)
  }

  const tickets = consulta.data ?? []
  const columnas = columnasTickets(manejarTicketUsado)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="text-sm font-semibold text-marca-600">Operación STAFF</p>
        <h1 className="mt-2 font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
          Tickets pagados
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Consulta las entradas pagadas del evento y valida su ingreso.
        </p>

        <form
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={handleSubmit(cambiarEvento)}
          noValidate
        >
          <div className="flex-1">
            <Campo
              etiqueta="Código de evento"
              placeholder="Ej. CMF-2026"
              autoComplete="off"
              {...register('eventCode')}
              error={errors.eventCode?.message}
            />
          </div>
          <Boton type="submit" cargando={consulta.isFetching} disabled={consulta.isFetching}>
            Consultar evento
          </Boton>
        </form>

        <div className="mt-6" aria-live="polite">
          {mensajeExito && (
            <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" role="status">
              {mensajeExito}
            </p>
          )}

          {consulta.isFetching && <Cargando mensaje="Cargando tickets pagados" />}

          {consulta.isError && (
            <EstadoError
              mensaje={mensajeErrorLista(consulta.error)}
              onReintentar={() => void consulta.refetch()}
            />
          )}

          {consulta.isSuccess && tickets.length === 0 && (
            <EstadoVacio
              titulo="Sin tickets pagados"
              mensaje="Todavía no hay tickets pagados para este evento."
            />
          )}

          {consulta.isSuccess && tickets.length > 0 && (
            <>
              <div
                className="hidden md:block"
                role="region"
                aria-label="Tickets pagados del evento"
              >
                <Tabla
                  columnas={columnas}
                  filas={tickets}
                  obtenerClave={(ticket) => ticket.id}
                />
              </div>

              <div className="space-y-3 md:hidden">
                {tickets.map((ticket) => (
                  <TarjetaTicket
                    key={ticket.id}
                    ticket={ticket}
                    alUsar={manejarTicketUsado}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
