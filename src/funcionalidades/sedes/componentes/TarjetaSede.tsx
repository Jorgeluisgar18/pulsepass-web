import { Link } from 'react-router'
import Badge from '../../../componentes/Badge'
import { RUTAS } from '../../../lib/rutas'
import { formatearCapacidad } from '../formato'
import type { Sede } from '../tipos'

interface TarjetaSedeProps {
  sede: Sede
}

export default function TarjetaSede({ sede }: TarjetaSedeProps) {
  return (
    <Link
      to={RUTAS.sede(sede.code)}
      className="group hover:border-marca-500 focus-visible:outline-marca-600 block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-slate-800 dark:bg-slate-900 dark:focus-visible:outline-marca-300"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-titulo group-hover:text-marca-600 text-lg font-bold text-slate-900 dark:text-slate-100">
          {sede.name}
        </h2>

        <Badge tono={sede.active ? 'exito' : 'neutral'}>
          {sede.active ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>

        <p>
          {sede.city}
          {' · '}
          Cap. {formatearCapacidad(sede.capacity)}
        </p>
      </div>
    </Link>
  )
}
