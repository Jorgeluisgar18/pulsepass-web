import { z } from 'zod'

export const errorResponseSchema = z.object({
    timestamp: z.string().min(1),
    status: z.number().int(),
    error: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.string()),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

export type TipoApiError =
    | 'http'
    | 'red'
    | 'respuesta-invalida'

interface ApiErrorParametros {
    tipo: TipoApiError
    message: string
    status?: number | null
    details?: Record<string, string>
}

export class ApiError extends Error {
    readonly tipo: TipoApiError
    readonly status: number | null
    readonly details: Record<string, string>

    constructor({
                    tipo,
                    message,
                    status = null,
                    details = {},
                }: ApiErrorParametros) {
        super(message)

        this.name = 'ApiError'
        this.tipo = tipo
        this.status = status
        this.details = details
    }
}

interface HttpOpciones extends Omit<RequestInit, 'headers'> {
    token?: string | null
    headers?: HeadersInit
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

function construirHeaders(
    opciones: HttpOpciones,
): Headers {
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
        headers.set(
            'Authorization',
            `Bearer ${opciones.token}`,
        )
    }

    return headers
}

async function leerJson(
    response: Response,
): Promise<unknown> {
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

function mensajeGenericoPorEstado(
    status: number,
): string {
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
        default:
            return 'Ocurrió un error al comunicarnos con el servidor.'
    }
}

async function construirErrorHttp(
    response: Response,
): Promise<ApiError> {
    const cuerpo = await leerJson(response)

    const resultado =
        errorResponseSchema.safeParse(cuerpo)

    if (
        resultado.success &&
        resultado.data.status === response.status
    ) {
        return new ApiError({
            tipo: 'http',
            status: response.status,
            message: resultado.data.message,
            details: resultado.data.details,
        })
    }

    return new ApiError({
        tipo: 'http',
        status: response.status,
        message: mensajeGenericoPorEstado(
            response.status,
        ),
    })
}

export async function http<
    TSchema extends z.ZodType,
>(
    ruta: string,
    schema: TSchema,
    opciones: HttpOpciones = {},
): Promise<z.infer<TSchema>> {
    const {
        token,
        headers: headersOriginales,
        ...requestInit
    } = opciones

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
            throw await construirErrorHttp(response)
        }

        const cuerpo = await leerJson(response)

        const resultado = schema.safeParse(cuerpo)

        if (!resultado.success) {
            throw new ApiError({
                tipo: 'respuesta-invalida',
                status: response.status,
                message:
                    'La respuesta del servidor no tiene el formato esperado.',
            })
        }

        return resultado.data
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