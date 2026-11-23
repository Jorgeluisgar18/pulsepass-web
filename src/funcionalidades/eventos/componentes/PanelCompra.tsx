import { Link } from 'react-router'
import { RUTAS } from '../../../lib/rutas'
import type { EstadoEvento } from '../tipos'

interface PanelCompraProps {
  eventCode: string
  estado: EstadoEvento
}

const motivosNoDisponible = {
  DRAFT:
    'El evento todavía no está publicado.',
  SOLD_OUT:
    'El evento está agotado.',
  CANCELLED:
    'El evento fue cancelado.',
  FINISHED:
    'El evento ya finalizó.',
} as const

interface AccionCompraProps {
  eventCode: string
  publicado: boolean
}

function AccionCompra({
                        eventCode,
                        publicado,
                      }: AccionCompraProps) {
  if (!publicado) {
    return (
      <button
        type="button"
        disabled
        className="min-h-11 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      >
        Compra no disponible
      </button>
    )
  }

  return (
    <Link
      to={RUTAS.login}
      state={{
        desde:
          RUTAS.evento(
            eventCode,
          ),
      }}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white transition hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
    >
      Inicia sesión para comprar
    </Link>
  )
}

export default function PanelCompra({
                                      eventCode,
                                      estado,
                                    }: PanelCompraProps) {
  const publicado =
    estado === 'PUBLISHED'

  return (
    <>
      <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:sticky md:top-24 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
          Entradas
        </h2>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {publicado
            ? 'Inicia sesión para elegir un tipo de entrada.'
            : motivosNoDisponible[
              estado
              ]}
        </p>

        <div className="mt-5">
          <AccionCompra
            eventCode={
              eventCode
            }
            publicado={
              publicado
            }
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
          El precio lo define el
          sistema al confirmar.
        </p>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-4 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-6xl">
          <AccionCompra
            eventCode={
              eventCode
            }
            publicado={
              publicado
            }
          />
        </div>
      </div>
    </>
  )
}