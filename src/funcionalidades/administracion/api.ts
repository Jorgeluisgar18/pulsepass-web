import { http } from '../../lib/http'
import { validarRespuesta } from '../../lib/validacion'
import type { Evento } from '../eventos/tipos'
import { eventoSchema } from '../eventos/tipos'
import type { CrearEventoRequest } from './tipos'

export async function obtenerEventoAdmin(eventCode: string, token: string) {
  const datos = await http(`/events/${encodeURIComponent(eventCode)}`, {
    token,
    operacion: 'autenticada',
  })

  return validarRespuesta(eventoSchema, datos)
}

export async function crearEventoApi(datos: CrearEventoRequest, token: string) {
  const respuesta = await http('/events', {
    method: 'POST',
    token,
    operacion: 'autenticada',
    body: JSON.stringify(datos),
  })

  return validarRespuesta(eventoSchema, respuesta)
}

export async function publicarEventoApi(eventCode: string, token: string): Promise<Evento> {
  const respuesta = await http(`/events/${encodeURIComponent(eventCode)}/publish`, {
    method: 'PATCH',
    token,
    operacion: 'autenticada',
  })

  return validarRespuesta(eventoSchema, respuesta)
}

export async function asociarArtistaApi(
  eventCode: string,
  artistId: number,
  token: string,
): Promise<Evento> {
  const respuesta = await http(
    `/events/${encodeURIComponent(eventCode)}/artists/${encodeURIComponent(String(artistId))}`,
    {
      method: 'POST',
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(eventoSchema, respuesta)
}
