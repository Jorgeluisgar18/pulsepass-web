import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter, Link, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider } from '../../../funcionalidades/auth/AuthContext'
import SoloAnonimo from '../../../funcionalidades/auth/componentes/SoloAnonimo'
import RutaPorRol from '../../../funcionalidades/auth/componentes/RutaPorRol'
import RutaProtegida from '../../../funcionalidades/auth/componentes/RutaProtegida'
import { useAuth } from '../../../funcionalidades/auth/hooks'
import { CLAVE_SESION_STORAGE } from '../../../funcionalidades/auth/sesion'
import { queryClient } from '../../../lib/queryClient'
import { RUTAS } from '../../../lib/rutas'
import Login from '../../../pages/Login'
import Cuenta from '../../../pages/Cuenta'
import { server } from '../../mocks/server'

const usuario = {
  userId: 42,
  username: 'ana',
  email: 'ana@example.com',
  roles: ['USER'],
}

function respuestaPendiente() {
  let resolve!: (response: Response) => void
  const promise = new Promise<Response>((resolver) => {
    resolve = resolver
  })
  return { promise, resolve }
}

function EstadoYEnlaces() {
  const { sesion, cerrarSesion } = useAuth()
  return (
    <>
      <output aria-label="Estado de sesión">{sesion.estado}</output>
      {sesion.estado === 'autenticado' && <p>{sesion.usuario.username}</p>}
      <Link to={RUTAS.eventos}>Ir a eventos</Link>
      <Link to={RUTAS.cuenta + '?tab=perfil#datos'}>Ir a cuenta</Link>
      <button type="button" onClick={() => cerrarSesion()}>
        Salir
      </button>
      <Outlet />
    </>
  )
}

function renderAplicacion(initialEntry: string = RUTAS.login) {
  const router = createMemoryRouter(
    [
      {
        element: (
          <AuthProvider>
            <EstadoYEnlaces />
          </AuthProvider>
        ),
        children: [
          {
            path: RUTAS.login,
            element: (
              <SoloAnonimo>
                <Login />
              </SoloAnonimo>
            ),
          },
          { path: RUTAS.eventos, element: <h1>Eventos públicos</h1> },
          { path: RUTAS.inicio, element: <h1>Inicio</h1> },
          {
            path: RUTAS.cuenta,
            element: (
              <RutaProtegida>
                <Cuenta />
              </RutaProtegida>
            ),
          },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  )
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

describe('Session continuity during navigation', () => {
  it('manual logout from a guarded account ends at home instead of login', async () => {
    window.sessionStorage.setItem(
      CLAVE_SESION_STORAGE,
      JSON.stringify({
        token: 'logout-test-token',
        expiraEn: Date.now() + 60_000,
        usuario,
      }),
    )
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
      mockHttp.get('/api/users/by-email', () =>
        HttpResponse.json({
          id: 42,
          ...usuario,
          active: true,
          firstName: 'Ana',
          lastName: 'Garcia',
          birthDate: '2000-01-01',
        }),
      ),
    )
    const user = userEvent.setup()
    const router = renderAplicacion(RUTAS.cuenta)
    await screen.findByRole('heading', { name: 'Ana Garcia' })
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(RUTAS.inicio),
    )
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
    expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
      'anonimo',
    )
  })
  it.each(['ADMIN', 'STAFF'] as const)(
    'renders the permitted route for %s',
    async (role) => {
      const identity = { ...usuario, roles: [role] }
      window.sessionStorage.setItem(
        CLAVE_SESION_STORAGE,
        JSON.stringify({
          token: 'role-test-token',
          expiraEn: Date.now() + 60_000,
          usuario: identity,
        }),
      )
      server.use(
        mockHttp.get('/api/auth/me', () => HttpResponse.json(identity)),
      )
      const route =
        role === 'ADMIN' ? RUTAS.adminEventos : RUTAS.staffValidacion
      const router = createMemoryRouter(
        [
          {
            element: (
              <AuthProvider>
                <Outlet />
              </AuthProvider>
            ),
            children: [
              {
                element: <RutaPorRol rolesPermitidos={[role]} />,
                children: [{ path: route, element: <h1>Allowed role</h1> }],
              },
            ],
          },
        ],
        { initialEntries: [route] },
      )
      render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>,
      )
      expect(
        await screen.findByRole('heading', { name: 'Allowed role' }),
      ).toBeInTheDocument()
      expect(router.state.location.pathname).toBe(route)
    },
  )

  it('discards an expired stored token before requesting identity', async () => {
    window.sessionStorage.setItem(
      CLAVE_SESION_STORAGE,
      JSON.stringify({
        token: 'expired-test-token',
        expiraEn: Date.now() - 1,
        usuario,
      }),
    )
    let requests = 0
    server.use(
      mockHttp.get('/api/auth/me', () => {
        requests += 1
        return HttpResponse.json(usuario)
      }),
    )
    renderAplicacion(RUTAS.inicio)
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'anonimo',
      ),
    )
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
    expect(requests).toBe(0)
  })
  it('keeps invalid-credentials feedback inside the real anonymous guard', async () => {
    const pending = respuestaPendiente()
    let requested = false
    server.use(
      mockHttp.post('/api/auth/login', () => {
        requested = true
        return pending.promise
      }),
    )
    const user = userEvent.setup()
    const router = renderAplicacion()
    const identifier = await screen.findByLabelText(
      'Usuario o correo electrónico',
    )
    await user.type(identifier, 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrect-password')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(requested).toBe(true))
    await act(async () => {
      pending.resolve(new HttpResponse(null, { status: 401 }))
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Credenciales inválidas',
    )
    expect(screen.getByLabelText('Usuario o correo electrónico')).toHaveValue(
      'ana',
    )
    expect(router.state.location.pathname).toBe(RUTAS.login)
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })
  beforeEach(() => {
    queryClient.clear()
  })

  it('uses the latest destination when a protected request expires after navigation', async () => {
    window.sessionStorage.setItem(
      CLAVE_SESION_STORAGE,
      JSON.stringify({
        token: 'navigation-test-token',
        expiraEn: Date.now() + 60_000,
        usuario,
      }),
    )
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
      mockHttp.get(
        '/api/users/by-email',
        () => new HttpResponse(null, { status: 401 }),
      ),
    )
    const user = userEvent.setup()
    const router = renderAplicacion(RUTAS.inicio)
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'autenticado',
      ),
    )
    await user.click(screen.getByRole('link', { name: 'Ir a cuenta' }))
    expect(await screen.findByText('Tu sesión expiró')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(RUTAS.login)
    expect(router.state.location.state).toMatchObject({
      desde: RUTAS.cuenta + '?tab=perfil#datos',
      motivo: 'expirada',
    })
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })

  it('keeps the restored session when navigating without another identity request', async () => {
    const stored = JSON.stringify({
      token: 'navigation-test-token',
      expiraEn: Date.now() + 60_000,
      usuario,
    })
    window.sessionStorage.setItem(CLAVE_SESION_STORAGE, stored)
    let requests = 0
    server.use(
      mockHttp.get('/api/auth/me', () => {
        requests += 1
        return HttpResponse.json(usuario)
      }),
    )
    const user = userEvent.setup()
    const router = renderAplicacion(RUTAS.inicio)
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'autenticado',
      ),
    )
    await user.click(screen.getByRole('link', { name: 'Ir a eventos' }))
    expect(
      await screen.findByRole('heading', { name: 'Eventos públicos' }),
    ).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(RUTAS.eventos)
    expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
      'autenticado',
    )
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBe(stored)
    expect(requests).toBe(1)
  })

  it('finishes a pending login after navigating to a public page', async () => {
    const pending = respuestaPendiente()
    let identityRequested = false
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'navigation-test-token',
          tokenType: 'Bearer',
          expiresIn: 900,
        }),
      ),
      mockHttp.get('/api/auth/me', () => {
        identityRequested = true
        return pending.promise
      }),
    )
    const user = userEvent.setup()
    const router = renderAplicacion()
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'anonimo',
      ),
    )
    await user.type(
      screen.getByLabelText('Usuario o correo electrónico'),
      'ana',
    )
    await user.type(screen.getByLabelText('Contraseña'), 'test-password')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(identityRequested).toBe(true))
    await user.click(screen.getByRole('link', { name: 'Ir a eventos' }))
    await act(async () => {
      pending.resolve(HttpResponse.json(usuario))
    })
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'autenticado',
      ),
    )
    expect(screen.getByText(usuario.username)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe(RUTAS.eventos)
    expect(
      JSON.parse(window.sessionStorage.getItem(CLAVE_SESION_STORAGE) ?? '{}'),
    ).toMatchObject({
      token: 'navigation-test-token',
      usuario,
    })
  })

  it('does not restore a pending login after an explicit logout', async () => {
    const pending = respuestaPendiente()
    let identityRequested = false
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'navigation-test-token',
          tokenType: 'Bearer',
          expiresIn: 900,
        }),
      ),
      mockHttp.get('/api/auth/me', () => {
        identityRequested = true
        return pending.promise
      }),
    )
    const user = userEvent.setup()
    const router = renderAplicacion()
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'anonimo',
      ),
    )
    await user.type(
      screen.getByLabelText('Usuario o correo electrónico'),
      'ana',
    )
    await user.type(screen.getByLabelText('Contraseña'), 'test-password')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    await waitFor(() => expect(identityRequested).toBe(true))
    await user.click(screen.getByRole('button', { name: 'Salir' }))
    await act(async () => {
      pending.resolve(HttpResponse.json(usuario))
    })
    await waitFor(() =>
      expect(screen.getByLabelText('Estado de sesión')).toHaveTextContent(
        'anonimo',
      ),
    )
    expect(router.state.location.pathname).toBe(RUTAS.inicio)
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })
})
