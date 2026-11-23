import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'
import type { Artista } from '../tipos'
import AvatarInicialesArtista from './AvatarInicialesArtista'

interface AvatarArtistaProps {
  artista: Artista
}

export default function AvatarArtista({ artista }: AvatarArtistaProps) {
  return (
    <Link
      to={RUTAS.artista(artista.id)}
      className="group focus-visible:outline-marca-600 flex min-w-0 items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-slate-800 dark:focus-visible:outline-marca-300"
    >
      <AvatarInicialesArtista stageName={artista.stageName} />

      <div className="min-w-0">
        <p className="group-hover:text-marca-600 truncate font-semibold text-slate-900 dark:text-slate-100">
          {artista.stageName}
        </p>

        {artista.genre && (
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
            {artista.genre}
          </p>
        )}
      </div>
    </Link>
  )
}
