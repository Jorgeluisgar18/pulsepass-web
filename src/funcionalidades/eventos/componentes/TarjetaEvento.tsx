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
import IconoCategoriaEvento from './IconoCategoriaEvento'

interface TarjetaEventoProps {
  evento: EventoResumen
}

const fondosCategoria = {
  MUSIC: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  SPORTS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  TECHNOLOGY: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  EDUCATION: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  CULTURE: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  ENTERTAINMENT: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
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
          'flex aspect-[16/9] items-center justify-center p-4',
          fondosCategoria[evento.category],
        )}
      >
        <IconoCategoriaEvento categoria={evento.category} className="h-12 w-12" />
      </div>

      <div className="space-y-3 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-marca-700 dark:text-marca-300">
          {etiquetaCategoria(evento.category)}
        </p>
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
