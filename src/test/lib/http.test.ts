import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpResponse, http as mockHttp } from 'msw'
import { ApiError, configurarManejadorNoAutorizado, http } from '../../lib/http'
import { server } from '../mocks/server'

describe('http', () => {
  it('oculta mensajes y detalles internos de un ErrorResponse 500 válido', async () => {
    server.use(
      mockHttp.get('/api/prueba/error-interno', () =>
        HttpResponse.json({
          timestamp: '2026-11-22T00:00:00',
          status: 500,
          error: 'Internal Server Error',
          message: 'SQL constraint failed',
          details: { database: 'internal diagnostic' },
        }, { status: 500 }),
      ),
    )

    await expect(http('/prueba/error-interno')).rejects.toMatchObject({
      status: 500,
      message: 'Ocurrió un error inesperado. Inténtalo más tarde.',
      details: {},
    })
  })

  afterEach(() => {
    configurarManejadorNoAutorizado(null)
  })

  it('devuelve el cuerpo JSON de una respuesta exitosa', async () => {
    server.use(
      mockHttp.get('/api/prueba/ok', () =>
        HttpResponse.json({
          mensaje: 'correcto',
        }),
      ),
    )

    const resultado = await http('/prueba/ok')

    expect(resultado).toEqual({
      mensaje: 'correcto',
    })
  })

  it('convierte ErrorResponse 400 en ApiError conservando details', async () => {
    server.use(
      mockHttp.get('/api/prueba/validacion', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-18T16:30:00',
            status: 400,
            error: 'Bad Request',
            message: 'Validation failed',
            details: {
              eventCode: 'Event code is required',
            },
          },
          {
            status: 400,
          },
        ),
      ),
    )

    await expect(http('/prueba/validacion')).rejects.toMatchObject({
      name: 'ApiError',
      tipo: 'http',
      status: 400,
      message: 'Validation failed',
      details: {
        eventCode: 'Event code is required',
      },
    })
  })

  it('usa un ApiError genérico cuando el cuerpo de error no cumple ErrorResponse', async () => {
    server.use(
      mockHttp.get('/api/prueba/error-invalido', () =>
        HttpResponse.json(
          {
            message: 'detalle interno que no debe exponerse',
          },
          {
            status: 500,
          },
        ),
      ),
    )

    await expect(http('/prueba/error-invalido')).rejects.toMatchObject({
      name: 'ApiError',
      tipo: 'http',
      status: 500,
      message: 'Ocurrió un error inesperado. Inténtalo más tarde.',
      details: {},
    })
  })

  it('convierte un fallo de red en ApiError de tipo red', async () => {
    server.use(mockHttp.get('/api/prueba/red', () => HttpResponse.error()))

    await expect(http('/prueba/red')).rejects.toMatchObject({
      name: 'ApiError',
      tipo: 'red',
      status: null,
    })
  })

  it('envía el JWT mediante Authorization Bearer', async () => {
    server.use(
      mockHttp.get('/api/prueba/token', ({ request }) => {
        expect(request.headers.get('Authorization')).toBe(
          'Bearer token-de-prueba',
        )

        return HttpResponse.json({
          mensaje: 'autorizado',
        })
      }),
    )

    const resultado = await http('/prueba/token', {
      token: 'token-de-prueba',
    })

    expect(resultado).toEqual({
      mensaje: 'autorizado',
    })
  })

  it('dispara el manejador de no autorizado ante 401', async () => {
    const manejador = vi.fn()

    configurarManejadorNoAutorizado(manejador)

    server.use(
      mockHttp.get('/api/prueba/401', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-18T16:30:00',
            status: 401,
            error: 'Unauthorized',
            message: 'Authentication is required or token is invalid',
            details: {},
          },
          {
            status: 401,
          },
        ),
      ),
    )

    await expect(http('/prueba/401', { token: 'jwt-valido' })).rejects.toMatchObject({
      status: 401,
      tipo: 'http',
    })

    expect(manejador).toHaveBeenCalledTimes(1)
  })

  it('ApiError conserva su información segura', () => {
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
