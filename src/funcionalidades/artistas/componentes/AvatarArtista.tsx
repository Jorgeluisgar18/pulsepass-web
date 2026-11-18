import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'
import type { Artista } from '../tipos'

interface AvatarArtistaProps {
    artista: Artista
}

function obtenerIniciales(
    stageName: string,
) {
    return stageName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
}

export default function AvatarArtista({
                                          artista,
                                      }: AvatarArtistaProps) {
    return (
        <Link
            to={RUTAS.artista(artista.id)}
            className="group flex min-w-0 items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:hover:bg-slate-800"
        >
            <div
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marca-50 font-titulo font-bold text-marca-700 dark:bg-marca-700 dark:text-white"
            >
                {obtenerIniciales(
                    artista.stageName,
                )}
            </div>

            <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 group-hover:text-marca-600 dark:text-slate-100">
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