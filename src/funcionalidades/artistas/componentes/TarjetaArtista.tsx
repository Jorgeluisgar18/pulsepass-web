import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'
import type { Artista } from '../tipos'
import AvatarInicialesArtista from './AvatarInicialesArtista'

interface TarjetaArtistaProps {
  artista: Artista
}

export default function TarjetaArtista({ artista }: TarjetaArtistaProps) {
  return (
    <Link
      to={RUTAS.artista(artista.id)}
      className="group hover:border-marca-500 focus-visible:outline-marca-600 flex min-h-48 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <AvatarInicialesArtista stageName={artista.stageName} tamano="grande" />

      <h2 className="font-titulo group-hover:text-marca-600 mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        {artista.stageName}
      </h2>

      {artista.genre && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {artista.genre}
        </p>
      )}
    </Link>
  )
}
