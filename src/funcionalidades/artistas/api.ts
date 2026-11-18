import { http } from '../../lib/http'
import {
    artistaSchema,
    artistasSchema,
} from './schemas'

export function obtenerArtistasActivos() {
    return http(
        '/artists/active',
        artistasSchema,
    )
}

export function obtenerArtistaPorId(
    id: number,
) {
    return http(
        `/artists/${encodeURIComponent(String(id))}`,
        artistaSchema,
    )
}

export function obtenerArtistaPorNombre(
    stageName: string,
) {
    const parametros = new URLSearchParams({
        stageName,
    })

    return http(
        `/artists/by-stage-name?${parametros.toString()}`,
        artistaSchema,
    )
}