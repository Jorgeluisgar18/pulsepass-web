import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from 'react-router'
import Badge from '../componentes/Badge'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import {
  useBuscarEventoAdmin,
  useEventosCreadosDeSesion,
} from '../funcionalidades/administracion/hooks'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import type { EstadoEvento } from '../funcionalidades/eventos/tipos'

const busquedaEventoSchema = z.object({
  codigo: z.string().trim().min(1, 'Ingresa el código del evento.'),
})
type BusquedaEvento = z.infer<typeof busquedaEventoSchema>

const etiquetasEstado: Record<EstadoEvento, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  SOLD_OUT: 'Agotado',
  CANCELLED: 'Cancelado',
  FINISHED: 'Finalizado',
}

function mensajeErrorBusqueda(error: unknown) {
  if (error instanceof ApiError && error.status === 403) {
    return 'No tienes permisos para consultar este evento.'
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'No encontramos un evento disponible con ese código.'
  }
  if (error instanceof Error) return error.message
  return 'No pudimos consultar el evento. Inténtalo de nuevo.'
}

export default function AdminEventos() {
  const [codigoBuscado, setCodigoBuscado] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<BusquedaEvento>({
    resolver: zodResolver(busquedaEventoSchema),
    defaultValues: { codigo: '' },
  })
  const eventosCreados = useEventosCreadosDeSesion()
  const consultaEvento = useBuscarEventoAdmin(codigoBuscado, Boolean(codigoBuscado))

  function buscarEvento({ codigo }: BusquedaEvento) {
    const codigoNormalizado = codigo.trim()
    if (codigoNormalizado === codigoBuscado) {
      void consultaEvento.refetch()
      return
    }
    setCodigoBuscado(codigoNormalizado)
  }

  const evento = consultaEvento.data
  const error404 = consultaEvento.error instanceof ApiError && consultaEvento.error.status === 404

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-marca-600 dark:text-marca-300">PulsePass</p>
          <h1 className="mt-2 font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
            Administración de eventos
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Busca un evento por su código o crea uno nuevo.
          </p>
        </div>
        <Link
          to={RUTAS.adminNuevoEvento}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:focus-visible:outline-marca-300"
        >
          Crear evento
        </Link>
      </header>

      <section
        aria-labelledby="buscar-evento-titulo"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 id="buscar-evento-titulo" className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
          Buscar evento
        </h2>
        <form onSubmit={handleSubmit(buscarEvento, () => setCodigoBuscado(''))} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Campo
              etiqueta="Código del evento"
              autoComplete="off"
              error={errors.codigo?.message}
              {...register('codigo')}
            />
          </div>
          <Boton type="submit" cargando={consultaEvento.isFetching}>
            Buscar evento
          </Boton>
        </form>

        {codigoBuscado && consultaEvento.isPending && <p className="mt-4" role="status">Buscando evento…</p>}
        {error404 && !consultaEvento.isFetching && (
          <div className="mt-4">
            <EstadoVacio titulo="Evento no encontrado" mensaje={mensajeErrorBusqueda(consultaEvento.error)} />
          </div>
        )}
        {consultaEvento.isError && !error404 && (
          <div className="mt-4">
            <EstadoError
              mensaje={mensajeErrorBusqueda(consultaEvento.error)}
              onReintentar={() => void consultaEvento.refetch()}
            />
          </div>
        )}

        {evento && !consultaEvento.isFetching && (
          <article className="mt-5 flex flex-col gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-titulo text-lg font-bold text-slate-900 dark:text-slate-100">{evento.name}</h3>
                <Badge tono={evento.status === 'PUBLISHED' ? 'exito' : 'neutral'}>
                  {etiquetasEstado[evento.status]}
                </Badge>
              </div>
              <p className="mt-1 break-all text-sm text-slate-600 dark:text-slate-400">{evento.eventCode}</p>
            </div>
            <Link
              to={RUTAS.adminEvento(evento.eventCode)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:outline-marca-300"
            >
              Gestionar evento
            </Link>
          </article>
        )}
      </section>

      <section
        aria-labelledby="eventos-sesion-titulo"
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 id="eventos-sesion-titulo" className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
          Eventos creados durante esta sesión
        </h2>
        {eventosCreados.data.length === 0 ? (
          <EstadoVacio
            titulo="Todavía no has creado eventos en esta sesión."
            mensaje="Los eventos que crees aparecerán aquí mientras mantengas la sesión iniciada."
          />
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {eventosCreados.data.map((eventoCreado) => (
              <li key={eventoCreado.eventCode}>
                <Link
                  to={RUTAS.adminEvento(eventoCreado.eventCode)}
                  className="block rounded-lg border border-slate-200 p-4 hover:border-marca-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:focus-visible:outline-marca-300"
                >
                  <span className="block font-semibold text-slate-900 dark:text-slate-100">{eventoCreado.name}</span>
                  <span className="mt-1 block break-all text-sm text-slate-600 dark:text-slate-400">
                    {eventoCreado.eventCode}
                  </span>
                  <span className="mt-3 block">
                    <Badge tono={eventoCreado.status === 'PUBLISHED' ? 'exito' : 'neutral'}>
                      {etiquetasEstado[eventoCreado.status]}
                    </Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
