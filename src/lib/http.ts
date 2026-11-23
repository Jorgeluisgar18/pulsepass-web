import { z } from 'zod'

export const errorResponseSchema = z.object({
  timestamp: z.string().min(1),
  status: z.number().int(),
  error: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.string()).optional().default({}),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

export type TipoApiError =
  | 'http'
  | 'red'
  | 'respuesta-invalida'

export type OrigenApiError =
  | 'login'
  | 'identidad'
  | 'autenticada'
  | 'publica'

interface ApiErrorParametros {
  tipo: TipoApiError
  message: string
  status?: number | null
  details?: Record<string, string>
  origen?: OrigenApiError
}

export class ApiError extends Error {
  readonly tipo: TipoApiError
  readonly status: number | null
  readonly details: Record<string, string>
  readonly origen: OrigenApiError

  constructor({
    tipo,
    message,
    status = null,
    details = {},
    origen = 'publica',
  }: ApiErrorParametros) {
    super(message)

    this.name = 'ApiError'
    this.tipo = tipo
    this.status = status
    this.details = details
    this.origen = origen
  }
}

export interface HttpOpciones
  extends Omit<RequestInit, 'headers'> {
  token?: string | null
  headers?: HeadersInit
  operacion?: OrigenApiError
}

type ManejadorNoAutorizado = (token: string) => void

let manejadorNoAutorizado: ManejadorNoAutorizado | null = null

export function configurarManejadorNoAutorizado(
  manejador: ManejadorNoAutorizado | null,
) {
  manejadorNoAutorizado = manejador
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? '/api'
).replace(/\/$/, '')

function construirUrl(ruta: string) {
  const rutaNormalizada = ruta.startsWith('/')
    ? ruta
    : `/${ruta}`

  return `${API_BASE_URL}${rutaNormalizada}`
}

function construirHeaders(opciones: HttpOpciones) {
  const headers = new Headers(opciones.headers)

  headers.set('Accept', 'application/json')

  if (
    opciones.body !== undefined &&
    opciones.body !== null &&
    !(opciones.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  if (opciones.token) {
    headers.set('Authorization', `Bearer ${opciones.token}`)
  }

  return headers
}

async function leerJson(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null
  }

  const texto = await response.text()

  if (!texto.trim()) {
    return null
  }

  try {
    return JSON.parse(texto) as unknown
  } catch {
    return null
  }
}

function mensajeGenericoPorEstado(status: number) {
  switch (status) {
    case 400:
      return 'La solicitud enviada no es válida.'
    case 401:
      return 'La autenticación es necesaria o ya no es válida.'
    case 403:
      return 'No tienes permisos para realizar esta operación.'
    case 404:
      return 'No encontramos el recurso solicitado.'
    case 409:
      return 'La operación entra en conflicto con el estado actual del recurso.'
    case 500:
      return 'Ocurrió un error inesperado. Inténtalo más tarde.'
    default:
      return 'Ocurrió un error al comunicarnos con el servidor.'
  }
}

async function construirErrorHttp(
  response: Response,
  origen: OrigenApiError,
) {
  if (response.status >= 500) {
    return new ApiError({
      tipo: 'http',
      status: response.status,
      message: 'Ocurrió un error inesperado. Inténtalo más tarde.',
      origen,
    })
  }

  const cuerpo = await leerJson(response)
  const resultado = errorResponseSchema.safeParse(cuerpo)

  if (
    resultado.success &&
    resultado.data.status === response.status
  ) {
    return new ApiError({
      tipo: 'http',
      status: response.status,
      message: resultado.data.message,
      details: resultado.data.details,
      origen,
    })
  }

  return new ApiError({
    tipo: 'http',
    status: response.status,
    message: mensajeGenericoPorEstado(response.status),
    origen,
  })
}

export async function http(
  ruta: string,
  opciones: HttpOpciones = {},
): Promise<unknown> {
  const {
    token,
    headers: headersOriginales,
    operacion,
    ...requestInit
  } = opciones
  const origen = operacion ?? (token ? 'autenticada' : 'publica')

  try {
    const response = await fetch(
      construirUrl(ruta),
      {
        ...requestInit,
        headers: construirHeaders({
          ...opciones,
          token,
          headers: headersOriginales,
        }),
      },
    )

    if (!response.ok) {
      const error = await construirErrorHttp(response, origen)

      if (
        response.status === 401 &&
        origen === 'autenticada' &&
        token
      ) {
        manejadorNoAutorizado?.(token)
      }

      throw error
    }

    return await leerJson(response)
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }

    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw error
    }

    throw new ApiError({
      tipo: 'red',
      message:
        'No pudimos conectar con el servidor. Inténtalo de nuevo.',
    })
  }
}
