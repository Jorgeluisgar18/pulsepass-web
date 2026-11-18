import clsx from 'clsx'
import type { ReactNode } from 'react'

type TipoAviso = 'exito' | 'error' | 'info' | 'advertencia'

interface AvisoProps {
    tipo: TipoAviso
    children: ReactNode
}

const estilos: Record<TipoAviso, string> = {
    exito: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-sky-200 bg-sky-50 text-sky-800',
    advertencia: 'border-amber-200 bg-amber-50 text-amber-800',
}

export default function Aviso({ tipo, children }: AvisoProps) {
    const esError = tipo === 'error'

    return (
        <div
            role={esError ? 'alert' : 'status'}
            aria-live={esError ? 'assertive' : 'polite'}
            className={clsx('rounded-lg border p-4 text-sm', estilos[tipo])}
        >
            {children}
        </div>
    )
}