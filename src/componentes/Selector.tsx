import clsx from 'clsx'
import { useId } from 'react'
import type { ComponentProps } from 'react'

interface SelectorProps extends ComponentProps<'select'> {
    etiqueta: string
    error?: string
}

export default function Selector({
                                     etiqueta,
                                     error,
                                     id,
                                     className,
                                     children,
                                     ...props
                                 }: SelectorProps) {
    const idGenerado = useId()
    const selectorId = id ?? idGenerado
    const errorId = `${selectorId}-error`

    return (
        <div className="space-y-2">
            <label
                htmlFor={selectorId}
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
                {etiqueta}
            </label>

            <select
                id={selectorId}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={clsx(
                    'min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 dark:bg-slate-900 dark:text-slate-100',
                    error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700',
                    className,
                )}
                {...props}
            >
                {children}
            </select>

            {error && (
                <p id={errorId} className="text-sm text-red-600 dark:text-red-300" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}