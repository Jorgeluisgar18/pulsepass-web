import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'

interface TarjetaSedeProps {
  code: string
  name: string
}

export default function TarjetaSede({ code, name }: TarjetaSedeProps) {
  return (
    <section>
      <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
        Sede
      </h2>

      <Link
        to={RUTAS.sede(code)}
        className="hover:border-marca-500 hover:bg-marca-50 focus-visible:outline-marca-600 mt-4 flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 p-4 transition focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="text-marca-600 h-6 w-6 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 21V8l8-5 8 5v13" />
          <path d="M9 21v-7h6v7" />
        </svg>

        <span className="min-w-0">
          <span className="block font-semibold text-slate-900 dark:text-slate-100">
            {name}
          </span>

          <span className="block text-sm text-slate-500 dark:text-slate-400">
            Ver información de la sede
          </span>
        </span>
      </Link>
    </section>
  )
}
