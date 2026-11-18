import { http } from '../../lib/http'
import { validarRespuesta } from '../../lib/validacion'
import {
    artistaSchema,
    artistasSchema,
} from './tipos'

export async function obtenerArtistasActivos() {
    const datos = await http(
        '/artists/active',
    )

    return validarRespuesta(
        artistasSchema,
        datos,
    )
}

export async function obtenerArtistaPorId(
    id: number,
) {
    const datos = await http(
        `/artists/${encodeURIComponent(
            String(id),
        )}`,
    )

    return validarRespuesta(
        artistaSchema,
        datos,
    )
}

export async function obtenerArtistaPorNombre(
    stageName: string,
) {
    const parametros = new URLSearchParams({
        stageName,
    })

    const datos = await http(
        `/artists/by-stage-name?${parametros.toString()}`,
    )

    return validarRespuesta(
        artistaSchema,
        datos,
    )
}