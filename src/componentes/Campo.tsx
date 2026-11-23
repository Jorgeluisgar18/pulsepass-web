import clsx from 'clsx'
import { useId } from 'react'
import type { ComponentProps } from 'react'

interface CampoProps extends ComponentProps<'input'> {
    etiqueta: string
    error?: string
}

export default function Campo({
                                  etiqueta,
                                  error,
                                  id,
                                  className,
                                  ...props
                              }: CampoProps) {
    const idGenerado = useId()
    const campoId = id ?? idGenerado
    const errorId = `${campoId}-error`

    return (
        <div className="space-y-2">
            <label
                htmlFor={campoId}
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
                {etiqueta}
            </label>

            <input
                id={campoId}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={clsx(
                    'min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 dark:bg-slate-900 dark:text-slate-100',
                    error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700',
                    className,
                )}
                {...props}
            />

            {error && (
                <p id={errorId} className="text-sm text-red-600 dark:text-red-300" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}