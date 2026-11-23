import { ApiError } from '../../../lib/http'
import Boton from '../../../componentes/Boton'
import { useMarcarTicketUsado } from '../hooks'
import type { TicketResponse } from '../tipos'

interface AccionUsarTicketProps {
  ticket: TicketResponse
  textoBoton?: string
  alUsar?: (ticket: TicketResponse) => void
}

function mensajeError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return 'No pudimos marcar el ticket como usado. Inténtalo de nuevo.'
  }

  switch (error.status) {
    case 403:
      return 'No tienes permisos para usar este ticket.'
    case 404:
      return 'No encontramos el ticket solicitado.'
    case 409:
      return 'Este ticket ya fue usado o no está pagado; no puede volver a utilizarse.'
    default:
      return error.tipo === 'red'
        ? 'No pudimos conectar con el servidor. Inténtalo de nuevo.'
        : 'No pudimos marcar el ticket como usado. Inténtalo de nuevo.'
  }
}

export default function AccionUsarTicket({
  ticket,
  textoBoton = 'Marcar como usado',
  alUsar,
}: AccionUsarTicketProps) {
  const mutacion = useMarcarTicketUsado(alUsar)

  if (ticket.status !== 'PAID') {
    return null
  }

  return (
    <div className="space-y-2">
      <Boton
        type="button"
        cargando={mutacion.isPending}
        disabled={mutacion.isPending}
        onClick={() => mutacion.mutate(ticket.ticketCode)}
        aria-label={textoBoton}
      >
        {textoBoton}
      </Boton>

      {mutacion.isError && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {mensajeError(mutacion.error)}
        </p>
      )}
    </div>
  )
}
