import { http } from '../../lib/http'
import { validarRespuesta } from '../../lib/validacion'
import {
    sedeSchema,
    sedesSchema,
} from './tipos'

export async function obtenerSedesActivas() {
    const datos = await http(
        '/venues/active',
    )

    return validarRespuesta(
        sedesSchema,
        datos,
    )
}

export async function obtenerSedePorCodigo(
    code: string,
) {
    const datos = await http(
        `/venues/${encodeURIComponent(code)}`,
    )

    return validarRespuesta(
        sedeSchema,
        datos,
    )
}