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