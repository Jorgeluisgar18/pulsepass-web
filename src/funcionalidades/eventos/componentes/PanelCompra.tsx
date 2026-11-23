import { Link } from 'react-router'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import Boton from '../../../componentes/Boton'
import Modal from '../../../componentes/Modal'
import { useAuth } from '../../auth/hooks'
import { RUTAS } from '../../../lib/rutas'
import { ApiError } from '../../../lib/http'
import { useComprarTicket } from '../../tickets/hooks'
import {
  seleccionTipoTicketSchema,
  type SeleccionTipoTicket,
} from '../../tickets/tipos'
import { etiquetaTipoTicket } from '../../tickets/formato'
import type { EstadoEvento } from '../tipos'
import { esVisiblePanelCompra } from '../visibilidadCompra'

interface PanelCompraProps {
  eventCode: string
  estado: EstadoEvento
  nombreEvento?: string
}

const motivosNoDisponible = {
  DRAFT: 'El evento todavía no está publicado.',
  SOLD_OUT: 'El evento está agotado.',
  CANCELLED: 'El evento fue cancelado.',
  FINISHED: 'El evento ya finalizó.',
} as const

interface AccionCompraProps {
  eventCode: string
  publicado: boolean
  estaAutenticado: boolean
  onComprar: () => void
}

function AccionCompra({
  eventCode,
  publicado,
  estaAutenticado,
  onComprar,
}: AccionCompraProps) {
  if (!publicado) {
    return (
      <button
        type="button"
        disabled
        className="min-h-11 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      >
        Compra no disponible
      </button>
    )
  }

  if (estaAutenticado) {
    return (
      <Boton className="w-full" onClick={onComprar}>
        Comprar entrada
      </Boton>
    )
  }

  return (
    <Link
      to={RUTAS.login}
      state={{
        desde: RUTAS.evento(eventCode),
      }}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white transition hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
    >
      Inicia sesión para comprar
    </Link>
  )
}

function mensajeErrorCompra(error: unknown) {
  if (error instanceof ApiError && error.status === 400) {
    return error.message
  }

  if (error instanceof ApiError && error.status === 403) {
    return 'No tienes permisos para comprar entradas.'
  }

  if (error instanceof ApiError && error.status === 409) {
    return error.message
  }

  return 'No pudimos completar la compra. Inténtalo de nuevo.'
}

export default function PanelCompra({
  eventCode,
  estado,
  nombreEvento,
}: PanelCompraProps) {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const compra = useComprarTicket(eventCode)
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false)
  const formulario = useForm<SeleccionTipoTicket>({
    resolver: zodResolver(seleccionTipoTicketSchema),
    defaultValues: { type: 'GENERAL' },
  })
  const tipoSeleccionado = useWatch({ control: formulario.control, name: 'type' })
  const mostrarPanel = esVisiblePanelCompra(sesion)

  if (!mostrarPanel) {
    return null
  }

  const estaAutenticado = sesion.estado === 'autenticado'
  const publicado = estado === 'PUBLISHED'
  const usuarioEmail = estaAutenticado ? sesion.usuario.email : ''

  function abrirConfirmacion() {
    compra.reset()
    setConfirmacionAbierta(true)
  }

  async function confirmarCompra({ type }: SeleccionTipoTicket) {
    try {
      const ticket = await compra.mutateAsync(type)
      navigate(RUTAS.confirmacionCompra(ticket.ticketCode))
    } catch {
      // El error permanece en la mutación y conserva abierto el diálogo.
    }
  }

  let mensajeAyuda: string = motivosNoDisponible[estado as keyof typeof motivosNoDisponible] ?? ''
  if (publicado) {
    mensajeAyuda = estaAutenticado
      ? 'Elige un tipo de entrada para continuar con la compra.'
      : 'Inicia sesión para elegir un tipo de entrada.'
  }

  return (
    <>
      <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:sticky md:top-24 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
          Entradas
        </h2>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {mensajeAyuda}
        </p>

        <div className="mt-5">
          <AccionCompra
            eventCode={eventCode}
            publicado={publicado}
            estaAutenticado={estaAutenticado}
            onComprar={abrirConfirmacion}
          />
        </div>

        {publicado && estaAutenticado && (
          <form
            className="mt-5 space-y-2"
            onSubmit={formulario.handleSubmit(confirmarCompra)}
            noValidate
          >
            <label
              htmlFor="tipo-entrada"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Tipo de entrada
            </label>
            <select
              id="tipo-entrada"
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-invalid={Boolean(formulario.formState.errors.type)}
              aria-describedby={
                formulario.formState.errors.type ? 'tipo-entrada-error' : undefined
              }
              {...formulario.register('type')}
            >
              <option value="GENERAL">General</option>
              <option value="VIP">VIP</option>
              <option value="BACKSTAGE">Backstage</option>
              <option value="STUDENT">Estudiante</option>
            </select>
            {formulario.formState.errors.type && (
              <p id="tipo-entrada-error" role="alert" className="text-sm text-red-600">
                {formulario.formState.errors.type.message}
              </p>
            )}
          </form>
        )}

        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
          El precio lo define el sistema al confirmar.
        </p>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-4 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-6xl">
          <AccionCompra
            eventCode={eventCode}
            publicado={publicado}
            estaAutenticado={estaAutenticado}
            onComprar={abrirConfirmacion}
          />
        </div>
      </div>

      <Modal
        abierto={confirmacionAbierta}
        titulo="Confirmar compra"
        onCerrar={() => setConfirmacionAbierta(false)}
      >
        <form
          className="space-y-5"
          onSubmit={formulario.handleSubmit(confirmarCompra)}
        >
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="font-medium text-slate-500 dark:text-slate-400">Evento</dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {nombreEvento ?? eventCode}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Tipo de entrada
              </dt>
              <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {etiquetaTipoTicket(tipoSeleccionado)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Correo electrónico
              </dt>
              <dd className="mt-1 break-all font-semibold text-slate-900 dark:text-slate-100">
                {usuarioEmail}
              </dd>
            </div>
          </dl>

          {compra.error && (
            <div role="alert" className="space-y-2 text-sm text-red-700 dark:text-red-300">
              <p>{mensajeErrorCompra(compra.error)}</p>
              {compra.error instanceof ApiError &&
                compra.error.status === 400 &&
                Object.values(compra.error.details).length > 0 && (
                  <ul className="list-disc space-y-1 pl-5">
                    {Object.values(compra.error.details).map((detalle) => (
                      <li key={detalle}>{detalle}</li>
                    ))}
                  </ul>
                )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Boton
              variante="secundario"
              disabled={compra.isPending}
              onClick={() => setConfirmacionAbierta(false)}
            >
              Volver
            </Boton>
            <Boton type="submit" cargando={compra.isPending}>
              Confirmar compra
            </Boton>
          </div>
        </form>
      </Modal>
    </>
  )
}
