import clsx from 'clsx'
import type { ReactNode } from 'react'

type TonoBadge =
  | 'neutral'
  | 'exito'
  | 'advertencia'
  | 'error'
  | 'info'
  | 'finalizado'

interface BadgeProps {
  tono?: TonoBadge
  children: ReactNode
  className?: string
}

const tonos: Record<
  TonoBadge,
  string
> = {
  neutral:
    'bg-slate-200 text-slate-700',
  exito:
    'bg-emerald-100 text-emerald-800',
  advertencia:
    'bg-amber-100 text-amber-800',
  error:
    'bg-red-100 text-red-800',
  info:
    'bg-sky-100 text-sky-800',
  finalizado:
    'bg-slate-300 text-slate-800',
}

export default function Badge({
                                tono = 'neutral',
                                children,
                                className,
                              }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        tonos[tono],
        className,
      )}
    >
            {children}
        </span>
  )
}