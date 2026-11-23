import { ApiError } from '../../lib/http'

export function mensajeErrorAdmin(error: unknown, fallback: string) {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback
  }

  if (error.status === 401) return 'Tu sesión ya no está disponible. Inicia sesión de nuevo.'
  if (error.status === 403) return 'No tienes permisos para realizar esta operación.'
  if (error.status === 404) return 'No encontramos el recurso solicitado.'
  return error.message || fallback
}
