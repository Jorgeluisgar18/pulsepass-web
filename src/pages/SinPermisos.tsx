import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function SinPermisos() {
    return (
        <section className="mx-auto flex max-w-6xl justify-center px-4 py-20">
            <div className="max-w-lg text-center">
                <p className="font-titulo text-6xl font-bold text-marca-600 dark:text-marca-300">
                    403
                </p>

                <h1 className="font-titulo mt-4 text-3xl font-bold">
                    No tienes permisos
                </h1>

                <p className="mt-3 text-slate-600 dark:text-slate-400">
                    No tienes permisos para acceder a esta sección.
                </p>

                <Link
                    to={RUTAS.inicio}
                    className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-marca-600 px-5 py-3 font-semibold text-white hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:focus-visible:outline-marca-300"
                >
                    Volver al inicio
                </Link>
            </div>
        </section>
    )
}