import { http } from '../../lib/http'
import {
    sedeSchema,
    sedesSchema,
} from './schemas'

export function obtenerSedesActivas() {
    return http(
        '/venues/active',
        sedesSchema,
    )
}

export function obtenerSedePorCodigo(
    code: string,
) {
    return http(
        `/venues/${encodeURIComponent(code)}`,
        sedeSchema,
    )
}