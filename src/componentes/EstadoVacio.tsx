import type { ReactNode } from 'react'

interface EstadoVacioProps {
    titulo: string
    mensaje?: string
    accion?: ReactNode
}

export default function EstadoVacio({
                                        titulo,
                                        mensaje,
                                        accion,
                                    }: EstadoVacioProps) {
    return (
        <div className="py-12 text-center">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 h-12 w-12 text-slate-500 dark:text-slate-400">
                <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" />
                <path d="m3 7 9 4 9-4M12 11v10" />
            </svg>
            <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
                {titulo}
            </h2>

            {mensaje && (
                <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
                    {mensaje}
                </p>
            )}

            {accion && <div className="mt-6">{accion}</div>}
        </div>
    )
}