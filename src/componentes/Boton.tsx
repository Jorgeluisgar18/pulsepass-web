import clsx from 'clsx'
import type { ComponentProps } from 'react'

type VarianteBoton = 'primario' | 'secundario' | 'peligro' | 'fantasma'

interface BotonProps extends ComponentProps<'button'> {
    variante?: VarianteBoton
    cargando?: boolean
}

const variantes: Record<VarianteBoton, string> = {
    primario:
        'bg-marca-600 text-white hover:bg-marca-700 disabled:bg-marca-500',
    secundario:
        'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
    peligro: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
    fantasma:
        'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
}

export default function Boton({
                                  variante = 'primario',
                                  cargando = false,
                                  disabled,
                                  className,
                                  children,
                                  type = 'button',
                                  ...props
                              }: BotonProps) {
    return (
        <button
            type={type}
            disabled={disabled || cargando}
            aria-busy={cargando || undefined}
            className={clsx(
                'inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 disabled:cursor-not-allowed disabled:opacity-70',
                variantes[variante],
                className,
            )}
            {...props}
        >
            {cargando ? 'Cargando…' : children}
        </button>
    )
}