import clsx from 'clsx'
import type { ReactNode } from 'react'

type TipoAviso = 'exito' | 'error' | 'info' | 'advertencia'

interface AvisoProps {
    tipo: TipoAviso
    children: ReactNode
}

const estilos: Record<TipoAviso, string> = {
    exito: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    info: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200',
    advertencia: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
}

export default function Aviso({ tipo, children }: AvisoProps) {
    const esError = tipo === 'error'

    return (
        <div
            role={esError ? 'alert' : 'status'}
            aria-live={esError ? 'assertive' : 'polite'}
            className={clsx('rounded-lg border p-4 text-sm', estilos[tipo])}
        >
            <div className="flex items-start gap-3">
                {esError && (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-5 w-5 shrink-0">
                        <path d="M12 3 2 21h20L12 3Z" />
                        <path d="M12 9v5m0 3v1" />
                    </svg>
                )}
                <div className="min-w-0 space-y-2">{children}</div>
            </div>
        </div>
    )
}