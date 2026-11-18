import { http } from '../../lib/http'
import {
    eventoSchema,
    eventosResumenSchema,
} from './schemas'

export function obtenerEventosPublicados() {
    return http(
        '/events/published',
        eventosResumenSchema,
    )
}

export function obtenerEventoPorCodigo(
    eventCode: string,
) {
    return http(
        `/events/${encodeURIComponent(eventCode)}`,
        eventoSchema,
    )
}

export function obtenerEventosPorArtista(
    stageName: string,
) {
    const parametros = new URLSearchParams({
        stageName,
    })

    return http(
        `/events/by-artist?${parametros.toString()}`,
        eventosResumenSchema,
    )
}