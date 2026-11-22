import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'
import type { Artista } from '../../artistas/tipos'

interface ListaArtistasEventoProps {
  artistas: Artista[]
}

function iniciales(stageName: string) {
  return stageName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export default function ListaArtistasEvento({
  artistas,
}: ListaArtistasEventoProps) {
  return (
    <section>
      <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
        Artistas
      </h2>

      {artistas.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Aún no hay artistas asociados.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          {artistas.map((artista) => (
            <Link
              key={artista.id}
              to={RUTAS.artista(artista.id)}
              className="hover:text-marca-700 focus-visible:outline-marca-600 flex min-h-11 items-center gap-2 rounded-full px-2 py-1 font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span
                aria-hidden="true"
                className="bg-marca-50 text-marca-700 dark:bg-marca-700 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold dark:text-white"
              >
                {iniciales(artista.stageName)}
              </span>

              <span>{artista.stageName}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
