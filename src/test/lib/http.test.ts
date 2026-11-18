import {
    HttpResponse,
    http as mockHttp,
} from 'msw'
import { z } from 'zod'
import { describe, expect, it } from 'vitest'
import {
    ApiError,
    http,
} from '../../lib/http'
import { server } from '../mocks/server'

const respuestaSchema = z.object({
    mensaje: z.string(),
})

describe('http', () => {
    it('devuelve una respuesta válida cuando coincide con el schema', async () => {
        server.use(
            mockHttp.get('/api/prueba/ok', () =>
                HttpResponse.json({
                    mensaje: 'correcto',
                }),
            ),
        )

        const resultado = await http(
            '/prueba/ok',
            respuestaSchema,
        )

        expect(resultado).toEqual({
            mensaje: 'correcto',
        })
    })

    it('convierte ErrorResponse 400 en ApiError conservando details', async () => {
        server.use(
            mockHttp.get(
                '/api/prueba/validacion',
                () =>
                    HttpResponse.json(
                        {
                            timestamp:
                                '2026-11-18T16:30:00',
                            status: 400,
                            error: 'Bad Request',
                            message: 'Validation failed',
                            details: {
                                eventCode:
                                    'Event code is required',
                            },
                        },
                        {
                            status: 400,
                        },
                    ),
            ),
        )

        await expect(
            http(
                '/prueba/validacion',
                respuestaSchema,
            ),
        ).rejects.toMatchObject({
            name: 'ApiError',
            tipo: 'http',
            status: 400,
            message: 'Validation failed',
            details: {
                eventCode:
                    'Event code is required',
            },
        })
    })

    it('rechaza una respuesta exitosa con formato inesperado', async () => {
        server.use(
            mockHttp.get(
                '/api/prueba/invalida',
                () =>
                    HttpResponse.json({
                        campoInesperado: true,
                    }),
            ),
        )

        await expect(
            http(
                '/prueba/invalida',
                respuestaSchema,
            ),
        ).rejects.toMatchObject({
            name: 'ApiError',
            tipo: 'respuesta-invalida',
            status: 200,
        })
    })

    it('convierte un fallo de red en ApiError de tipo red', async () => {
        server.use(
            mockHttp.get(
                '/api/prueba/red',
                () => HttpResponse.error(),
            ),
        )

        await expect(
            http(
                '/prueba/red',
                respuestaSchema,
            ),
        ).rejects.toMatchObject({
            name: 'ApiError',
            tipo: 'red',
            status: null,
        })
    })

    it('envía el JWT únicamente mediante Authorization Bearer', async () => {
        server.use(
            mockHttp.get(
                '/api/prueba/token',
                ({ request }) => {
                    const authorization =
                        request.headers.get(
                            'Authorization',
                        )

                    if (
                        authorization !==
                        'Bearer token-de-prueba'
                    ) {
                        return HttpResponse.json(
                            {
                                timestamp:
                                    '2026-11-18T16:30:00',
                                status: 401,
                                error: 'Unauthorized',
                                message:
                                    'Authentication is required or token is invalid',
                                details: {},
                            },
                            {
                                status: 401,
                            },
                        )
                    }

                    return HttpResponse.json({
                        mensaje: 'autorizado',
                    })
                },
            ),
        )

        const resultado = await http(
            '/prueba/token',
            respuestaSchema,
            {
                token: 'token-de-prueba',
            },
        )

        expect(resultado.mensaje).toBe(
            'autorizado',
        )
    })
})

describe('ApiError', () => {
    it('es una instancia de Error y conserva su información segura', () => {
        const error = new ApiError({
            tipo: 'http',
            status: 409,
            message: 'Conflicto de negocio',
            details: {
                eventCode: 'Duplicado',
            },
        })

        expect(error).toBeInstanceOf(Error)
        expect(error.name).toBe('ApiError')
        expect(error.status).toBe(409)
        expect(error.details).toEqual({
            eventCode: 'Duplicado',
        })
    })
})