import { http } from '../../lib/http'
import { validarRespuesta } from '../../lib/validacion'
import {
    eventoSchema,
    eventosResumenSchema,
} from './tipos'

export async function obtenerEventosPublicados() {
    const datos = await http(
        '/events/published',
    )

    return validarRespuesta(
        eventosResumenSchema,
        datos,
    )
}

export async function obtenerEventoPorCodigo(
    eventCode: string,
) {
    const datos = await http(
        `/events/${encodeURIComponent(
            eventCode,
        )}`,
    )

    return validarRespuesta(
        eventoSchema,
        datos,
    )
}

export async function obtenerEventosPorArtista(
    stageName: string,
) {
    const parametros = new URLSearchParams({
        stageName,
    })

    const datos = await http(
        `/events/by-artist?${parametros.toString()}`,
    )

    return validarRespuesta(
        eventosResumenSchema,
        datos,
    )
}