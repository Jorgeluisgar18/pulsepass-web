interface CargandoProps {
    mensaje?: string
}

export default function Cargando({
                                     mensaje = 'Cargando…',
                                 }: CargandoProps) {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            className="space-y-3 py-6"
        >
            <span className="sr-only">{mensaje}</span>

            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
        </div>
    )
}