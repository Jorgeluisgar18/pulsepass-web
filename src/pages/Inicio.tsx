import { Link } from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function Inicio() {
    return (
        <>
            <section className="bg-linear-to-r from-marca-600 to-acento-500 text-white">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
                        Eventos · artistas · entradas
                    </p>

                    <h1 className="font-titulo max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Descubre los mejores eventos
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
                        Música, cultura, deporte y tecnología en un solo lugar.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={RUTAS.eventos}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-marca-700 transition hover:bg-marca-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Ver cartelera
                        </Link>

                        <Link
                            to={RUTAS.registro}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Crear cuenta
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-semibold text-marca-600">
                        PulsePass
                    </p>

                    <h2 className="font-titulo mt-2 text-2xl font-bold">
                        Catálogo público
                    </h2>

                    <p className="mt-3 text-slate-600 dark:text-slate-400">
                        Los próximos eventos y artistas destacados se conectarán con la
                        API en la Etapa 6 del plan de implementación.
                    </p>
                </div>
            </section>
        </>
    )
}