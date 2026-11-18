import { useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

interface ModalProps {
    abierto: boolean
    titulo: string
    onCerrar: () => void
    children: ReactNode
}

const selectorFoco =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({
                                  abierto,
                                  titulo,
                                  onCerrar,
                                  children,
                              }: ModalProps) {
    const contenedorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!abierto) return

        const focoAnterior = document.activeElement as HTMLElement | null
        const elementos =
            contenedorRef.current?.querySelectorAll<HTMLElement>(selectorFoco)

        elementos?.[0]?.focus()

        return () => {
            focoAnterior?.focus()
        }
    }, [abierto])

    if (!abierto) return null

    function manejarTeclado(evento: KeyboardEvent<HTMLDivElement>) {
        if (evento.key === 'Escape') {
            evento.preventDefault()
            onCerrar()
            return
        }

        if (evento.key !== 'Tab') return

        const elementos = Array.from(
            contenedorRef.current?.querySelectorAll<HTMLElement>(selectorFoco) ?? [],
        )

        if (elementos.length === 0) {
            evento.preventDefault()
            return
        }

        const primero = elementos[0]
        const ultimo = elementos[elementos.length - 1]

        if (!primero || !ultimo) return

        if (evento.shiftKey && document.activeElement === primero) {
            evento.preventDefault()
            ultimo.focus()
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
            evento.preventDefault()
            primero.focus()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            onMouseDown={(evento) => {
                if (evento.target === evento.currentTarget) onCerrar()
            }}
        >
            <div
                ref={contenedorRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal"
                onKeyDown={manejarTeclado}
                className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <h2
                        id="titulo-modal"
                        className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100"
                    >
                        {titulo}
                    </h2>

                    <button
                        type="button"
                        onClick={onCerrar}
                        aria-label="Cerrar"
                        className="min-h-11 min-w-11 rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-marca-600 dark:hover:bg-slate-800"
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    )
}