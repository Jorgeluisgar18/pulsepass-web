interface PaginaEnConstruccionProps {
    titulo: string
    descripcion: string
}

export default function PaginaEnConstruccion({
                                                 titulo,
                                                 descripcion,
                                             }: PaginaEnConstruccionProps) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold text-marca-600">
                    PulsePass
                </p>

                <h1 className="font-titulo mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {titulo}
                </h1>

                <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                    {descripcion}
                </p>
            </div>
        </section>
    )
}