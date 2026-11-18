import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
                <p>© 2026 PulsePass · Caso de estudio académico</p>

                <nav
                    aria-label="Pie de página"
                    className="flex items-center gap-4"
                >
                    <Link
                        to={RUTAS.sedes}
                        className="rounded hover:text-marca-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                    >
                        Sedes
                    </Link>

                    <Link
                        to={RUTAS.artistas}
                        className="rounded hover:text-marca-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                    >
                        Artistas
                    </Link>
                </nav>
            </div>
        </footer>
    )
}