import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { describe, expect, it } from 'vitest'
import { obtenerUsuarioPorUsernameApi } from '../../../funcionalidades/auth/api'
import { useAuth } from '../../../funcionalidades/auth/hooks'
import * as authHooks from '../../../funcionalidades/auth/hooks'
import { CLAVE_SESION_STORAGE } from '../../../funcionalidades/auth/sesion'
import type { Rol, UsuarioAutenticado, UsuarioRespuesta } from '../../../funcionalidades/auth/tipos'
import Cuenta from '../../../pages/Cuenta'
import { RUTAS } from '../../../lib/rutas'
import { renderConRouter } from '../../utils/renderConRouter'
import { server } from '../../mocks/server'

const usuarioValidado: UsuarioAutenticado = {
  userId: 42,
  username: 'ana.verificada',
  email: 'ana.verificada@example.com',
  roles: ['USER'],
}

const perfil: UsuarioRespuesta = {
  id: 42,
  username: usuarioValidado.username,
  email: usuarioValidado.email,
  active: true,
  firstName: 'Ana',
  lastName: 'Garcia',
  birthDate: '2000-01-01',
}

function guardarSesion(usuario = usuarioValidado) {
  window.sessionStorage.setItem(
    CLAVE_SESION_STORAGE,
    JSON.stringify({
      token: 'token-cuenta',
      expiraEn: Date.now() + 60_000,
      usuario,
    }),
  )
}

function renderCuenta() {
  return renderConRouter(<Cuenta />, {
    rutaInicial: RUTAS.cuenta,
    ruta: RUTAS.cuenta,
  })
}

describe('perfil propio de Cuenta', () => {
  it('expone el hook useUsuarioPorUsername', () => {
    expect(Reflect.get(authHooks, 'useUsuarioPorUsername')).toBeTypeOf('function')
  })

  it('codifica username, envía Bearer y valida la respuesta con el esquema Zod', async () => {
    let urlSolicitada = ''
    let autorizacion: string | null = null

    server.use(
      mockHttp.get('/api/users/by-username', ({ request }) => {
        urlSolicitada = request.url
        autorizacion = request.headers.get('Authorization')
        return HttpResponse.json(perfil)
      }),
    )

    const resultado = await obtenerUsuarioPorUsernameApi(
      'ana+staff/uno',
      'jwt-cuenta',
    )

    expect(new URL(urlSolicitada).search).toBe('?username=ana%2Bstaff%2Funo')
    expect(autorizacion).toBe('Bearer jwt-cuenta')
    expect(resultado).toEqual(perfil)
  })

  it('rechaza respuestas que no cumplen el esquema Zod del usuario', async () => {
    server.use(
      mockHttp.get('/api/users/by-username', () =>
        HttpResponse.json({ ...perfil, firstName: '' }),
      ),
    )

    await expect(
      obtenerUsuarioPorUsernameApi(usuarioValidado.username, 'jwt-cuenta'),
    ).rejects.toMatchObject({ name: 'ZodError' })
  })

  it.each(['USER', 'STAFF', 'ADMIN'] as const)(
    'mantiene email como consulta inicial y permite username para el rol %s',
    async (rol: Rol) => {
      const usuarioGuardado = {
        ...usuarioValidado,
        username: 'usuario-antiguo',
        email: 'antiguo@example.com',
        roles: [rol],
      }
      let consultasPorEmail = 0
      const consultasPorUsername: string[] = []
      let solicitudesAuthMe = 0

      guardarSesion(usuarioGuardado)
      server.use(
        mockHttp.get('/api/auth/me', ({ request }) => {
          solicitudesAuthMe += 1
          if (request.headers.get('Authorization') !== 'Bearer token-cuenta') {
            return HttpResponse.json({}, { status: 401 })
          }
          return HttpResponse.json({ ...usuarioValidado, roles: [rol] })
        }),
        mockHttp.get('/api/users/by-email', ({ request }) => {
          consultasPorEmail += 1
          expect(new URL(request.url).searchParams.get('email')).toBe(
            usuarioValidado.email,
          )
          expect(request.headers.get('Authorization')).toBe('Bearer token-cuenta')
          return HttpResponse.json(perfil)
        }),
        mockHttp.get('/api/users/by-username', ({ request }) => {
          consultasPorUsername.push(request.url)
          expect(request.headers.get('Authorization')).toBe('Bearer token-cuenta')
          return HttpResponse.json(perfil)
        }),
      )

      const user = userEvent.setup()
      renderCuenta()

      expect(await screen.findByRole('heading', { name: 'Ana Garcia' })).toBeInTheDocument()
      expect(screen.getByText(rol)).toBeInTheDocument()
      expect(solicitudesAuthMe).toBe(1)
      expect(consultasPorEmail).toBe(1)
      expect(consultasPorUsername).toHaveLength(0)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

      await user.click(
        screen.getByRole('button', { name: 'Consultar por nombre de usuario' }),
      )

      await waitFor(() => expect(consultasPorUsername).toHaveLength(1))
      expect(new URL(consultasPorUsername[0]!).searchParams.get('username')).toBe(
        usuarioValidado.username,
      )
      expect(consultasPorEmail).toBe(1)
      expect(await screen.findByRole('heading', { name: 'Ana Garcia' })).toBeInTheDocument()
    },
  )

  it('mantiene el error 403 visible y reintenta username sin consultar email', async () => {
    let consultasPorEmail = 0
    let consultasPorUsername = 0

    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuarioValidado)),
      mockHttp.get('/api/users/by-email', () => {
        consultasPorEmail += 1
        return HttpResponse.json(perfil)
      }),
      mockHttp.get('/api/users/by-username', () => {
        consultasPorUsername += 1
        return HttpResponse.json(
          {
            timestamp: '2026-11-23T00:00:00Z',
            status: 403,
            error: 'Forbidden',
            message: 'No tienes permisos para consultar por username.',
            details: {},
          },
          { status: 403 },
        )
      }),
    )

    const user = userEvent.setup()
    renderCuenta()
    await screen.findByRole('heading', { name: 'Ana Garcia' })

    await user.click(
      screen.getByRole('button', { name: 'Consultar por nombre de usuario' }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos cargar la información de tu cuenta.',
    )
    expect(consultasPorEmail).toBe(1)
    expect(consultasPorUsername).toBe(1)

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    await waitFor(() => expect(consultasPorUsername).toBe(2))
    expect(consultasPorEmail).toBe(1)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('no consulta perfiles cuando no hay sesión autenticada', async () => {
    let consultasDePerfil = 0
    server.use(
      mockHttp.get('/api/auth/me', () => {
        consultasDePerfil += 1
        return HttpResponse.json(usuarioValidado)
      }),
      mockHttp.get('/api/users/by-email', () => {
        consultasDePerfil += 1
        return HttpResponse.json(perfil)
      }),
      mockHttp.get('/api/users/by-username', () => {
        consultasDePerfil += 1
        return HttpResponse.json(perfil)
      }),
    )

    function CuentaConEstadoSesion() {
      const { sesion } = useAuth()
      return (
        <>
          <output>{sesion.estado}</output>
          <Cuenta />
        </>
      )
    }

    renderConRouter(<CuentaConEstadoSesion />, {
      rutaInicial: RUTAS.cuenta,
      ruta: RUTAS.cuenta,
    })

    expect(await screen.findByText('anonimo')).toBeInTheDocument()
    expect(consultasDePerfil).toBe(0)
  })
})
