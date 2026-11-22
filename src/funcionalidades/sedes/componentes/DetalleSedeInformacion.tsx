import Badge from '../../../componentes/Badge'
import { formatearCapacidad } from '../formato'
import type { Sede } from '../tipos'

interface DetalleSedeInformacionProps {
  sede: Sede
}

export default function DetalleSedeInformacion({
  sede,
}: DetalleSedeInformacionProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="font-titulo text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {sede.name}
        </h1>

        <Badge tono={sede.active ? 'exito' : 'neutral'}>
          {sede.active ? 'Activa' : 'Inactiva'}
        </Badge>
      </header>

      <dl className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm text-slate-500 dark:text-slate-400">Código</dt>

          <dd className="font-medium text-slate-900 sm:text-right dark:text-slate-100">
            {sede.code}
          </dd>
        </div>

        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm text-slate-500 dark:text-slate-400">Ciudad</dt>

          <dd className="font-medium text-slate-900 sm:text-right dark:text-slate-100">
            {sede.city}
          </dd>
        </div>

        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm text-slate-500 dark:text-slate-400">
            Capacidad
          </dt>

          <dd className="font-medium text-slate-900 sm:text-right dark:text-slate-100">
            {formatearCapacidad(sede.capacity)} personas
          </dd>
        </div>

        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm text-slate-500 dark:text-slate-400">
            Dirección
          </dt>

          <dd className="font-medium text-slate-900 sm:text-right dark:text-slate-100">
            {sede.address}
          </dd>
        </div>

        <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="text-sm text-slate-500 dark:text-slate-400">Estado</dt>

          <dd className="font-medium text-slate-900 sm:text-right dark:text-slate-100">
            {sede.active ? 'Activa' : 'Inactiva'}
          </dd>
        </div>
      </dl>
    </article>
  )
}
