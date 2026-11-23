import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Badge from '../componentes/Badge'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import Campo from '../componentes/Campo'
import EstadoError from '../componentes/EstadoError'
import PrecioCOP from '../componentes/PrecioCOP'
import AccionUsarTicket from '../funcionalidades/tickets/componentes/AccionUsarTicket'
import { useTicket } from '../funcionalidades/tickets/hooks'
import {
  etiquetaEstadoTicket,
  etiquetaTipoTicket,
  formatearFechaCompra,
  tonoEstadoTicket,
} from '../funcionalidades/tickets/formato'
import type { TicketResponse } from '../funcionalidades/tickets/tipos'
import { ApiError } from '../lib/http'

const formularioBusquedaSchema = z.object({
  ticketCode: z.string().trim().min(1, 'Ingresa un código de ticket.'),
})

type FormularioBusqueda = z.infer<typeof formularioBusquedaSchema>

function mensajeErrorBusqueda(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 403 || error.status === 404) {
      return 'El ticket no existe o no está disponible para validación.'
    }

    if (error.status === 401) {
      return 'Tu sesión ya no está activa. Inicia sesión nuevamente.'
    }

    if (error.tipo === 'red') {
      return 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
    }
  }

  return 'No pudimos consultar el ticket. Inténtalo de nuevo.'
}

function DetalleTicket({ ticket }: { ticket: TicketResponse }) {
  return (
    <dl className="mt-6 grid gap-4 sm:grid-cols-2">
      <div>
        <dt className="text-sm text-slate-500 dark:text-slate-400">Código</dt>
        <dd className="mt-1 break-all font-semibold">{ticket.ticketCode}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500 dark:text-slate-400">Evento</dt>
        <dd className="mt-1 font-semibold">{ticket.eventName}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500 dark:text-slate-400">Código de evento</dt>
        <dd className="mt-1 font-semibold">{ticket.eventCode}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500 dark:text-slate-400">Tipo de entrada</dt>
        <dd className="mt-1 font-semibold">{etiquetaTipoTicket(ticket.type)}</dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500 dark:text-slate-400">Precio</dt>
        <dd className="mt-1 font-semibold">
          <PrecioCOP valor={ticket.price} />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-slate-500 dark:text-slate-400">Fecha de compra</dt>
        <dd className="mt-1 font-semibold">{formatearFechaCompra(ticket.purchaseDate)}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-sm text-slate-500 dark:text-slate-400">Correo del titular</dt>
        <dd className="mt-1 break-all font-semibold">{ticket.userEmail}</dd>
      </div>
    </dl>
  )
}

export default function ValidacionIngreso() {
  const [codigoConsultado, setCodigoConsultado] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const codigoEnVueloRef = useRef<string | null>(null)
  const {
    register,
    handleSubmit,
    setFocus,
    resetField,
    formState: { errors },
  } = useForm<FormularioBusqueda>({
    resolver: zodResolver(formularioBusquedaSchema),
    defaultValues: { ticketCode: '' },
    mode: 'onSubmit',
  })
  const consulta = useTicket(codigoConsultado, Boolean(codigoConsultado))

  useEffect(() => {
    if (
      !consulta.isFetching &&
      codigoEnVueloRef.current === codigoConsultado
    ) {
      codigoEnVueloRef.current = null
    }
  }, [consulta.isFetching, codigoConsultado])

  useEffect(() => {
    if (
      codigoConsultado &&
      !consulta.isFetching &&
      (consulta.isSuccess || consulta.isError)
    ) {
      setFocus('ticketCode')
    }
  }, [
    codigoConsultado,
    consulta.isError,
    consulta.isFetching,
    consulta.isSuccess,
    setFocus,
    resetField,
  ])

  function buscarTicket({ ticketCode }: FormularioBusqueda) {
    setMensajeExito('')

    if (codigoEnVueloRef.current === ticketCode) {
      return
    }

    if (ticketCode === codigoConsultado) {
      if (!consulta.isFetching) {
        codigoEnVueloRef.current = ticketCode
        void consulta.refetch()
      }
      return
    }

    codigoEnVueloRef.current = ticketCode
    setCodigoConsultado(ticketCode)
  }

  function manejarTicketUsado() {
    resetField('ticketCode')
    setMensajeExito('Ticket marcado como usado.')
    setFocus('ticketCode')
  }

  const ticket = consulta.data

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p className="text-sm font-semibold text-marca-600 dark:text-marca-300">Operación STAFF</p>
        <h1 className="mt-2 font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
          Validación de ingreso
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Busca el código de la entrada para verificarla antes de permitir el ingreso.
        </p>

        <form
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={(event) => void handleSubmit(buscarTicket)(event)}
          noValidate
        >
          <div className="flex-1">
            <Campo
              etiqueta="Código de ticket"
              placeholder="Ej. TKT-2026-ABC123"
              autoComplete="off"
              autoFocus
              {...register('ticketCode')}
              error={errors.ticketCode?.message}
            />
          </div>
          <Boton
            type="submit"
            cargando={consulta.isFetching}
            disabled={consulta.isFetching}
          >
            Buscar ticket
          </Boton>
        </form>

        <div className="mt-6" aria-live="polite">
          {mensajeExito && (
            <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" role="status">
              {mensajeExito}
            </p>
          )}

          {consulta.isFetching && <Cargando mensaje="Buscando ticket" />}

          {consulta.isError && (
            consulta.error instanceof ApiError &&
            (consulta.error.status === 403 || consulta.error.status === 404) ? (
              <div role="alert" className="py-12 text-center">
                <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
                  Ticket no disponible
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {mensajeErrorBusqueda(consulta.error)}
                </p>
              </div>
            ) : (
              <EstadoError
                mensaje={mensajeErrorBusqueda(consulta.error)}
                onReintentar={() => void consulta.refetch()}
              />
            )
          )}

          {consulta.isSuccess && ticket && (
            <section
              aria-label="Resultado del ticket"
              className="rounded-xl border border-slate-200 p-5 dark:border-slate-700 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
                    {ticket.eventName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Entrada {ticket.ticketCode}
                  </p>
                </div>
                <Badge tono={tonoEstadoTicket(ticket.status)}>
                  {etiquetaEstadoTicket(ticket.status)}
                </Badge>
              </div>

              <DetalleTicket ticket={ticket} />

              {ticket.status === 'PAID' ? (
                <div className="mt-6">
                  <AccionUsarTicket
                    ticket={ticket}
                    alUsar={manejarTicketUsado}
                  />
                </div>
              ) : (
                <p className="mt-6 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {ticket.status === 'USED'
                    ? 'Este ticket ya fue utilizado.'
                    : 'Solo los tickets pagados pueden marcarse como usados.'}
                </p>
              )}
            </section>
          )}
        </div>
      </section>
    </div>
  )
}
