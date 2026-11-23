import clsx from 'clsx'
import {
  etiquetaCategoria,
  formatearFechaHoraEvento,
} from '../../../lib/formato'
import type { CategoriaEvento, Evento } from '../tipos'
import BadgeEstado from './BadgeEstado'
import IconoCategoriaEvento from './IconoCategoriaEvento'

interface DetalleEventoCabeceraProps {
  evento: Evento
}

const fondosCategoria: Record<CategoriaEvento, string> = {
  MUSIC:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  SPORTS:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  TECHNOLOGY:
    'bg-slate-200 text-marca-700 dark:bg-slate-800 dark:text-marca-500',
  EDUCATION: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  CULTURE: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  ENTERTAINMENT:
    'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
}

export default function DetalleEventoCabecera({
  evento,
}: DetalleEventoCabeceraProps) {
  return (
    <>
      <div
        className={clsx(
          'flex aspect-[16/6] items-center justify-center rounded-t-xl',
          fondosCategoria[evento.category],
        )}
      >
        <IconoCategoriaEvento categoria={evento.category} />
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-marca-700 dark:text-marca-500 text-xs font-bold tracking-wide uppercase">
            {etiquetaCategoria(evento.category)}
          </span>

          <BadgeEstado estado={evento.status} />
        </div>

        <h1 className="font-titulo text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {evento.name}
        </h1>

        <dl className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-6 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Fecha y hora</dt>
            <dd>{formatearFechaHoraEvento(evento.eventDate)}</dd>
          </div>

          {evento.minimumAge !== null && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Edad mínima</dt>
              <dd>Edad mínima: {evento.minimumAge}</dd>
            </div>
          )}
        </dl>

        <p className="leading-7 text-slate-700 dark:text-slate-300">
          {evento.description ?? 'Sin descripción disponible.'}
        </p>
      </div>
    </>
  )
}
