import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it } from 'vitest'
import {
  iniciarSesionApi,
  obtenerPerfilAutenticadoApi,
  obtenerUsuarioPorEmailApi,
  obtenerUsuarioPorUsernameApi,
  registrarUsuarioApi,
} from '../../../funcionalidades/auth/api'
import { ApiError } from '../../../lib/http'
import { server } from '../../mocks/server'

const registro = {
  username: 'ana', email: 'ana@example.com', firstName: 'Ana', lastName: 'Garcia',
  phone: '', city: '', birthDate: '2000-01-01', password: 'test-password-123',
}

const casos = [
  { nombre: 'login', metodo: 'POST', ruta: '/api/auth/login', status: 200, ejecutar: () => iniciarSesionApi({ identifier: 'ana', password: 'test-password-123' }) },
  { nombre: 'identidad autenticada', metodo: 'GET', ruta: '/api/auth/me', status: 200, ejecutar: () => obtenerPerfilAutenticadoApi('test-token') },
  { nombre: 'registro', metodo: 'POST', ruta: '/api/users', status: 201, ejecutar: () => registrarUsuarioApi(registro) },
  { nombre: 'perfil por email', metodo: 'GET', ruta: '/api/users/by-email', status: 200, ejecutar: () => obtenerUsuarioPorEmailApi('ana@example.com', 'test-token') },
  { nombre: 'perfil por username', metodo: 'GET', ruta: '/api/users/by-username', status: 200, ejecutar: () => obtenerUsuarioPorUsernameApi('ana', 'test-token') },
]

describe('NFR-FE-006 errores uniformes de respuestas auth', () => {
  it.each(casos)('$nombre convierte DTO inválido con HTTP $status en ApiError seguro', async (caso) => {
    const marcador = 'PRIVATE_RESPONSE_SENTINEL'
    const handler = caso.metodo === 'POST' ? mockHttp.post : mockHttp.get
    server.use(handler(caso.ruta, () => HttpResponse.json({ password: marcador, accessToken: marcador, email: marcador }, { status: caso.status })))

    const error: unknown = await caso.ejecutar().catch((fallo: unknown) => fallo)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      name: 'ApiError',
      tipo: 'respuesta-invalida',
      message: 'La respuesta del servidor no tiene el formato esperado.',
      details: {},
    })
    expect(String(error)).not.toContain(marcador)
    expect(JSON.stringify(error)).not.toContain(marcador)
  })
})
