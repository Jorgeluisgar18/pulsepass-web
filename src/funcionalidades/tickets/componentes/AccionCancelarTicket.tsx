import { useState } from 'react'
import Boton from '../../../componentes/Boton'
import Modal from '../../../componentes/Modal'
import { ApiError } from '../../../lib/http'
import { etiquetaTipoTicket } from '../formato'
import { useCancelarTicket } from '../hooks'
import type { TicketResponse } from '../tipos'

interface AccionCancelarTicketProps {
  ticket: TicketResponse
}

function mensajeErrorCancelacion(error: unknown) {
  if (error instanceof ApiError && error.status === 409) {
    return error.message
  }

  if (error instanceof ApiError && error.status === 400) {
    return error.message
  }

  if (error instanceof ApiError && error.status === 403) {
    return 'No tienes permisos para cancelar este ticket.'
  }

  return 'No pudimos cancelar el ticket. Inténtalo de nuevo.'
}

export default function AccionCancelarTicket({
  ticket,
}: AccionCancelarTicketProps) {
  const [abierto, setAbierto] = useState(false)
  const cancelar = useCancelarTicket()

  if (ticket.status !== 'PAID') {
    return null
  }

  function abrirConfirmacion() {
    cancelar.reset()
    setAbierto(true)
  }

  async function confirmarCancelacion() {
    try {
      await cancelar.mutateAsync(ticket.ticketCode)
      setAbierto(false)
    } catch {
      // El error permanece en la mutación para conservar el diálogo y su contexto.
    }
  }

  return (
    <>
      <Boton
        variante="peligro"
        onClick={abrirConfirmacion}
        aria-label={`Cancelar ticket ${ticket.ticketCode}`}
      >
        Cancelar
      </Boton>

      <Modal
        abierto={abierto}
        titulo="Cancelar ticket"
        onCerrar={() => setAbierto(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            ¿Confirmas la cancelación de la entrada{' '}
            <strong>{etiquetaTipoTicket(ticket.type)}</strong> para{' '}
            <strong>{ticket.eventName}</strong>?
          </p>

          {cancelar.error && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              {mensajeErrorCancelacion(cancelar.error)}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Boton
              variante="secundario"
              disabled={cancelar.isPending}
              onClick={() => setAbierto(false)}
            >
              Volver
            </Boton>
            <Boton
              variante="peligro"
              cargando={cancelar.isPending}
              onClick={() => void confirmarCancelacion()}
            >
              Confirmar cancelación
            </Boton>
          </div>
        </div>
      </Modal>
    </>
  )
}
