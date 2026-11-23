import clsx from 'clsx'
import { Link } from 'react-router'
import Badge from '../../../componentes/Badge'
import {
  etiquetaCategoria,
  etiquetaEstado,
  formatearFechaEvento,
} from '../../../lib/formato'
import { RUTAS } from '../../../lib/rutas'
import type { EventoResumen } from '../tipos'

interface TarjetaEventoProps {
  evento: EventoResumen
}

const fondosCategoria = {
  MUSIC: 'from-violet-600 via-marca-600 to-indigo-700',
  SPORTS: 'from-emerald-600 via-teal-600 to-cyan-700',
  TECHNOLOGY: 'from-slate-700 via-indigo-700 to-marca-700',
  EDUCATION: 'from-sky-600 via-blue-600 to-indigo-700',
  CULTURE: 'from-fuchsia-600 via-rose-600 to-acento-500',
  ENTERTAINMENT: 'from-orange-500 via-rose-500 to-acento-500',
} as const

const tonoEstado = {
  DRAFT: 'neutral',
  PUBLISHED: 'exito',
  SOLD_OUT: 'advertencia',
  CANCELLED: 'error',
  FINISHED: 'finalizado',
} as const

export default function TarjetaEvento({ evento }: TarjetaEventoProps) {
  return (
    <Link
      to={RUTAS.evento(evento.eventCode)}
      className="group focus-visible:outline-marca-600 block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-slate-800 dark:bg-slate-900 dark:focus-visible:outline-marca-300"
    >
      <div
        aria-hidden="true"
        className={clsx(
          'flex aspect-[16/9] items-end bg-linear-to-br p-4 text-white',
          fondosCategoria[evento.category],
        )}
      >
        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {etiquetaCategoria(evento.category)}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-titulo group-hover:text-marca-600 text-lg font-bold text-slate-900 dark:text-slate-100">
            {evento.name}
          </h2>

          <Badge tono={tonoEstado[evento.status]}>
            {etiquetaEstado(evento.status)}
          </Badge>
        </div>

        <dl className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <dt className="sr-only">Fecha</dt>

            <dd>{formatearFechaEvento(evento.eventDate)}</dd>
          </div>

          <div>
            <dt className="sr-only">Sede</dt>

            <dd>{evento.venueName}</dd>
          </div>
        </dl>
      </div>
    </Link>
  )
}
