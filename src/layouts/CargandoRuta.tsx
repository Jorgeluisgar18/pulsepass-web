export default function CargandoRuta() {
    return (
        <main
            aria-busy="true"
            aria-live="polite"
            className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
        >
            <div className="w-full max-w-md space-y-4">
                <span className="sr-only">Cargando página</span>

                <div className="h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

                <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
        </main>
    )
}