import { http } from '../../lib/http'
import { validarRespuesta } from '../../lib/validacion'
import {
  solicitudCompraTicketSchema,
  ticketSchema,
  ticketsSchema,
  type SolicitudCompraTicket,
  type TicketResponse,
} from './tipos'

export async function comprarTicketApi(
  solicitud: SolicitudCompraTicket,
  token: string,
): Promise<TicketResponse> {
  const solicitudValidada = solicitudCompraTicketSchema.parse(solicitud)
  const respuesta = await http('/tickets', {
    method: 'POST',
    body: JSON.stringify(solicitudValidada),
    token,
    operacion: 'autenticada',
  })

  return validarRespuesta(ticketSchema, respuesta)
}

export async function obtenerTicketApi(
  ticketCode: string,
  token: string,
): Promise<TicketResponse> {
  const respuesta = await http(
    `/tickets/${encodeURIComponent(ticketCode)}`,
    {
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(ticketSchema, respuesta)
}

export async function obtenerTicketsPorUsuarioApi(
  email: string,
  token: string,
): Promise<TicketResponse[]> {
  const parametros = new URLSearchParams({ email })
  const respuesta = await http(`/tickets/by-user?${parametros.toString()}`, {
    token,
    operacion: 'autenticada',
  })

  return validarRespuesta(ticketsSchema, respuesta)
}

export async function cancelarTicketApi(
  ticketCode: string,
  token: string,
): Promise<TicketResponse> {
  const respuesta = await http(
    `/tickets/${encodeURIComponent(ticketCode)}/cancel`,
    {
      method: 'PATCH',
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(ticketSchema, respuesta)
}

export async function obtenerTicketsPagadosEventoApi(
  eventCode: string,
  token: string,
): Promise<TicketResponse[]> {
  const respuesta = await http(
    `/events/${encodeURIComponent(eventCode)}/tickets/paid`,
    {
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(ticketsSchema, respuesta)
}

export async function marcarTicketUsadoApi(
  ticketCode: string,
  token: string,
): Promise<TicketResponse> {
  const respuesta = await http(
    `/tickets/${encodeURIComponent(ticketCode)}/use`,
    {
      method: 'PATCH',
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(ticketSchema, respuesta)
}
