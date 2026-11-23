import { QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../../funcionalidades/auth/AuthContext'
import { CLAVE_SESION_STORAGE } from '../../../funcionalidades/auth/sesion'
import RutaPorRol from '../../../funcionalidades/auth/componentes/RutaPorRol'
import RutaProtegida from '../../../funcionalidades/auth/componentes/RutaProtegida'
import SoloAnonimo from '../../../funcionalidades/auth/componentes/SoloAnonimo'
import { useAuth } from '../../../funcionalidades/auth/hooks'
import { registroUsuarioSchema } from '../../../funcionalidades/auth/tipos'
import Login from '../../../pages/Login'
import Registro from '../../../pages/Registro'
import Cuenta from '../../../pages/Cuenta'
import { RUTAS } from '../../../lib/rutas'
import { queryClient } from '../../../lib/queryClient'
import { server } from '../../mocks/server'

const usuario = {
  userId: 42,
  username: 'ana',
  email: 'ana@example.com',
  roles: ['USER'],
}

function guardarSesion(expiraEn = Date.now() + 60_000) {
  window.sessionStorage.setItem(
    CLAVE_SESION_STORAGE,
    JSON.stringify({
      token: 'jwt-restaurado',
      expiraEn,
      usuario,
    }),
  )
}

function renderRuta(rutas: Parameters<typeof createMemoryRouter>[0], initialEntry: string) {
  const router = createMemoryRouter(rutas, { initialEntries: [initialEntry] })

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return router
}

function AuthProbe() {
  const { sesion, cerrarSesion, tieneRol } = useAuth()

  return (
    <div>
      <span>{sesion.estado}</span>
      {sesion.estado === 'autenticado' && (
        <>
          <span>{sesion.usuario.username}</span>
          <span>{tieneRol('ADMIN') ? 'admin' : 'sin-admin'}</span>
          <button type="button" onClick={() => cerrarSesion()}>
            cerrar-sesion
          </button>
        </>
      )}
    </div>
  )
}

function AuthLogoutProbe() {
  const { cerrarSesion } = useAuth()
  return (
    <button type="button" onClick={() => cerrarSesion()}>
      probar-cierre
    </button>
  )
}

describe('TEST-FE-AUTH', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('AUTH-001 inicia sesión y consulta la identidad real', async () => {
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'jwt-valido',
          tokenType: 'Bearer',
          expiresIn: 3600,
        }),
      ),
      mockHttp.get('/api/auth/me', ({ request }) => {
        if (request.headers.get('Authorization') !== 'Bearer jwt-valido') {
          return HttpResponse.json({}, { status: 401 })
        }

        return HttpResponse.json(usuario)
      }),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.login, element: <Login /> },
            { path: RUTAS.inicio, element: <div>Inicio autenticado</div> },
          ],
        },
      ],
      RUTAS.login,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-segura-12')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText('Inicio autenticado')).toBeInTheDocument()
  })

  it('AUTH-002 muestra credenciales inválidas ante 401 de login', async () => {
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 401,
            error: 'Unauthorized',
            message: 'Credenciales incorrectas',
            details: {},
          },
          { status: 401 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.login, element: <Login /> }],
        },
      ],
      RUTAS.login,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas')
  })

  it('AUTH-003 restaura una sesión no expirada desde sessionStorage', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: '/', element: <AuthProbe /> }],
        },
      ],
      '/',
    )

    await act(async () => {})
    expect(screen.getByText('autenticado')).toBeInTheDocument()
    expect(screen.getByText('ana')).toBeInTheDocument()
  })

  it('AUTH-004 cierra sesión y limpia caché sensible', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )
    const limpiarCache = vi.spyOn(queryClient, 'clear')
    const user = userEvent.setup()

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: '/', element: <AuthProbe /> }],
        },
      ],
      '/',
    )

    await user.click(await screen.findByRole('button', { name: 'cerrar-sesion' }))

    expect(screen.getByText('anonimo')).toBeInTheDocument()
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
    expect(limpiarCache).toHaveBeenCalled()
  })

  it('TEST-FE-AUTH-007 protege rutas privadas y conserva state.desde', async () => {
    const router = renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.login, element: <div>Vista login</div> },
            {
              element: <RutaProtegida />,
              children: [{ path: RUTAS.cuenta, element: <div>Cuenta privada</div> }],
            },
          ],
        },
      ],
      `${RUTAS.cuenta}?tab=perfil#datos`,
    )

    expect(await screen.findByText('Vista login')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.state).toMatchObject({
      desde: '/cuenta?tab=perfil#datos',
    })
  })

  it('AUTH-006 redirige sin rol a 403 y permite el rol correcto', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.sinPermisos, element: <div>Página 403</div> },
            {
              element: <RutaPorRol rolesPermitidos={['ADMIN']} />,
              children: [{ path: RUTAS.adminEventos, element: <div>Administración</div> }],
            },
          ],
        },
      ],
      RUTAS.adminEventos,
    )

    expect(await screen.findByText('Página 403')).toBeInTheDocument()
  })

  it('AUTH-007 registra y redirige a login con aviso', async () => {
    server.use(
      mockHttp.post('/api/users', () =>
        HttpResponse.json(
          {
            id: 42,
            username: 'ana',
            email: 'ana@example.com',
            active: true,
            firstName: 'Ana',
            lastName: 'Garcia',
            phone: null,
            city: null,
            birthDate: '2000-01-01',
          },
          { status: 201 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.registro, element: <Registro /> },
            { path: RUTAS.login, element: <Login /> },
          ],
        },
      ],
      RUTAS.registro,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'contraseña-segura-123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByText('Cuenta creada, inicia sesión')).toBeInTheDocument()
  })

  it('AUTH-008 informa duplicados de registro sin exponer detalles internos', async () => {
    server.use(
      mockHttp.post('/api/users', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 409,
            error: 'Conflict',
            message: 'username unique constraint',
            details: {},
          },
          { status: 409 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.registro, element: <Registro /> }],
        },
      ],
      RUTAS.registro,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'contraseña-segura-123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El usuario o correo ya está registrado',
    )
  })

  it('AUTH-009 valida contraseña UTF-8 de máximo 72 bytes', () => {
    const base = {
      username: 'ana',
      email: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'Garcia',
      phone: '',
      city: '',
      birthDate: '2000-01-01',
    }

    expect(
      registroUsuarioSchema.safeParse({
        ...base,
        password: 'contraseña'.repeat(10),
      }).success,
    ).toBe(false)

    expect(
      registroUsuarioSchema.safeParse({
        ...base,
        password: 'contraseña123',
      }).success,
    ).toBe(true)
  })

  it('AUTH-010 expira una sesión restaurada y la cierra', async () => {
    guardarSesion(Date.now() + 50)
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: '/', element: <AuthProbe /> }],
        },
      ],
      '/',
    )

    expect(await screen.findByText('autenticado')).toBeInTheDocument()
    await waitFor(
      () => expect(screen.getByText('anonimo')).toBeInTheDocument(),
      { timeout: 500 },
    )
  })

  it('AUTH-011 carga identidad y perfil propio en Mi cuenta', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
      mockHttp.get('/api/users/by-email', ({ request }) => {
        const url = new URL(request.url)
        if (url.searchParams.get('email') !== usuario.email) {
          return HttpResponse.json({}, { status: 400 })
        }

        return HttpResponse.json({
          id: 42,
          username: 'ana',
          email: 'ana@example.com',
          active: true,
          firstName: 'Ana',
          lastName: 'Garcia',
          phone: null,
          city: 'Bogota',
          birthDate: '2000-01-01',
        })
      }),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.cuenta, element: <Cuenta /> }],
        },
      ],
      RUTAS.cuenta,
    )

    expect(await screen.findByRole('heading', { name: 'Ana Garcia' })).toBeInTheDocument()
    expect(screen.getByText('@ana')).toBeInTheDocument()
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
    expect(screen.getByText('USER')).toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Nacimiento: 01/01/2000')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver mis tickets' })).toHaveAttribute(
      'href',
      RUTAS.misTickets,
    )
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
  })

  it('AUTH-012 conserva la ruta de origen después del inicio de sesión', async () => {
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'jwt-valido',
          tokenType: 'Bearer',
          expiresIn: 3600,
        }),
      ),
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )

    const user = userEvent.setup()
    const router = createMemoryRouter(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.login, element: <Login /> },
            { path: RUTAS.misTickets, element: <div>Tickets de origen</div> },
          ],
        },
      ],
      {
        initialEntries: [
          {
            pathname: RUTAS.login,
            state: { desde: RUTAS.misTickets },
          },
        ],
      },
    )

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-segura-12')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText('Tickets de origen')).toBeInTheDocument()
  })

  it('AUTH-013 asigna un error 400 al campo de registro correspondiente', async () => {
    server.use(
      mockHttp.post('/api/users', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 400,
            error: 'Bad Request',
            message: 'Solicitud inválida',
            details: { email: 'El correo electrónico ya tiene formato inválido.' },
          },
          { status: 400 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.registro, element: <Registro /> }],
        },
      ],
      RUTAS.registro,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'contraseña-segura-123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByText('El correo electrónico ya tiene formato inválido.'),
    ).toBeInTheDocument()
  })

  it('AUTH-014 cierra una sesión ante un 401 de una petición autenticada', async () => {
    guardarSesion()
    const limpiarCache = vi.spyOn(queryClient, 'clear')

    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
      mockHttp.get('/api/users/by-email', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 401,
            error: 'Unauthorized',
            message: 'Sesión expirada',
            details: {},
          },
          { status: 401 },
        ),
      ),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: '/', element: <AuthProbe /> },
            { path: RUTAS.cuenta, element: <Cuenta /> },
          ],
        },
      ],
      RUTAS.cuenta,
    )

    await waitFor(() => {
      expect(limpiarCache).toHaveBeenCalled()
      expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
    })
  })

  it('7A rechaza tokenType distinto de Bearer', async () => {
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'jwt-valido',
          tokenType: 'Basic',
          expiresIn: 3600,
        }),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.login, element: <Login /> }],
        },
      ],
      RUTAS.login,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-segura-12')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })

  it('7A rechaza roles distintos de USER STAFF ADMIN durante restauración', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () =>
        HttpResponse.json({
          ...usuario,
          roles: ['SUPERUSER'],
        }),
      ),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: '/', element: <AuthProbe /> }],
        },
      ],
      '/',
    )

    expect(await screen.findByText('anonimo')).toBeInTheDocument()
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })

  it('7A distingue 401 de /auth/me posterior al login exitoso', async () => {
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'jwt-sin-identidad',
          tokenType: 'Bearer',
          expiresIn: 3600,
        }),
      ),
      mockHttp.get('/api/auth/me', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 401,
            error: 'Unauthorized',
            message: 'token rejected',
            details: {},
          },
          { status: 401 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.login, element: <Login /> }],
        },
      ],
      RUTAS.login,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-segura-12')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    const alerta = await screen.findByRole('alert')
    expect(alerta).toHaveTextContent('No pudimos validar tu sesión')
    expect(alerta).not.toHaveTextContent('Credenciales inválidas')
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })

  it('7A rechaza sesión restaurada malformada', async () => {
    window.sessionStorage.setItem(
      CLAVE_SESION_STORAGE,
      JSON.stringify({ token: '', expiraEn: 'mañana', usuario: {} }),
    )

    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: '/', element: <AuthProbe /> }],
        },
      ],
      '/',
    )

    expect(await screen.findByText('anonimo')).toBeInTheDocument()
    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
  })

  it('7A no deja que /auth/me antiguo reemplace una sesión nueva', async () => {
    let resolverViejo: ((value: Response) => void) | null = null

    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json({
          accessToken: 'token-uno',
          tokenType: 'Bearer',
          expiresIn: 3600,
        }),
      ),
      mockHttp.get('/api/auth/me', async () =>
        await new Promise<Response>((resolve) => {
          resolverViejo = resolve
        }),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            {
              path: RUTAS.login,
              element: (
                <>
                  <Login />
                  <AuthLogoutProbe />
                </>
              ),
            },
          ],
        },
      ],
      RUTAS.login,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-segura-12')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    await waitFor(() => expect(resolverViejo).not.toBeNull())

    await user.click(screen.getByRole('button', { name: 'probar-cierre' }))

    if (resolverViejo) {
      ;(resolverViejo as (value: Response) => void)(
        HttpResponse.json(usuario),
      )
    }

    await waitFor(() => {
      expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
    })
    expect(screen.queryByText('autenticado')).not.toBeInTheDocument()
  })

  it('7B logout manual limpia la sesión y navega al inicio', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )
    const user = userEvent.setup()

    const router = createMemoryRouter(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.inicio, element: <AuthLogoutProbe /> },
            { path: RUTAS.cuenta, element: <AuthLogoutProbe /> },
          ],
        },
      ],
      { initialEntries: [RUTAS.cuenta] },
    )

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await screen.findByRole('button', { name: 'probar-cierre' })
    await user.click(screen.getByRole('button', { name: 'probar-cierre' }))

    expect(window.sessionStorage.getItem(CLAVE_SESION_STORAGE)).toBeNull()
    expect(router.state.location.pathname).toBe(RUTAS.inicio)
  })

  it('7B una sesión expirada redirige a login con motivo y destino seguro', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
      mockHttp.get('/api/users/by-email', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 401,
            error: 'Unauthorized',
            message: 'expired',
            details: {},
          },
          { status: 401 },
        ),
      ),
    )

    const router = createMemoryRouter(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.login, element: <Login /> },
            { path: RUTAS.cuenta, element: <Cuenta /> },
          ],
        },
      ],
      { initialEntries: ['/cuenta?tab=perfil#datos'] },
    )

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(RUTAS.login)
      expect(router.state.location.state).toMatchObject({
        motivo: 'expirada',
        desde: '/cuenta?tab=perfil#datos',
      })
    })
  })

  it('7B SoloAnonimo rechaza destinos externos en state.desde', async () => {
    guardarSesion()
    server.use(
      mockHttp.get('/api/auth/me', () => HttpResponse.json(usuario)),
    )

    const router = createMemoryRouter(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.inicio, element: <div>Inicio seguro</div> },
            {
              element: <SoloAnonimo />,
              children: [{ path: RUTAS.login, element: <div>Login</div> }],
            },
          ],
        },
      ],
      {
        initialEntries: [
          {
            pathname: RUTAS.login,
            state: { desde: 'https://malicioso.example/' },
          },
        ],
      },
    )

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Inicio seguro')).toBeInTheDocument()
  })

  it('7C login vacío muestra errores y no envía solicitudes', async () => {
    let solicitudes = 0
    server.use(
      mockHttp.post('/api/auth/login', () => {
        solicitudes += 1
        return HttpResponse.json({}, { status: 401 })
      }),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.login, element: <Login /> }],
        },
      ],
      RUTAS.login,
    )

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(
      await screen.findByText('El usuario o correo electrónico es obligatorio.'),
    ).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument()
    expect(solicitudes).toBe(0)
  })

  it('7C login 400 asigna campo conocido y conserva aviso desconocido', async () => {
    server.use(
      mockHttp.post('/api/auth/login', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 400,
            error: 'Bad Request',
            message: 'Solicitud inválida',
            details: {
              identifier: 'Usa un usuario o correo válido.',
              bloqueo: 'Cuenta temporalmente bloqueada.',
            },
          },
          { status: 400 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.login, element: <Login /> }],
        },
      ],
      RUTAS.login,
    )

    await user.type(screen.getByLabelText('Usuario o correo electrónico'), 'ana')
    await user.type(screen.getByLabelText('Contraseña'), 'clave-segura-12')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(
      await screen.findByText('Usa un usuario o correo válido.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Cuenta temporalmente bloqueada.')).toBeInTheDocument()
  })

  it('7C registro con contraseña corta no envía solicitudes', async () => {
    let solicitudes = 0
    server.use(
      mockHttp.post('/api/users', () => {
        solicitudes += 1
        return HttpResponse.json({}, { status: 201 })
      }),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.registro, element: <Registro /> }],
        },
      ],
      RUTAS.registro,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'corta')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByText('La contraseña debe tener al menos 12 caracteres.'),
    ).toBeInTheDocument()
    expect(solicitudes).toBe(0)
  })

  it('7C rechaza fecha de nacimiento inexistente', async () => {
    const resultado = registroUsuarioSchema.safeParse({
      username: 'ana',
      email: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'Garcia',
      phone: '',
      city: '',
      birthDate: '2026-02-30',
      password: 'contraseña-segura-123',
    })

    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(
        resultado.error.issues.some((issue) =>
          issue.message.includes('fecha de nacimiento'),
        ),
      ).toBe(true)
    }
  })

  it('7C registro 400 conserva campos conocidos y claves desconocidas', async () => {
    server.use(
      mockHttp.post('/api/users', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 400,
            error: 'Bad Request',
            message: 'Solicitud inválida',
            details: {
              email: 'El correo no está disponible.',
              seguridad: 'La validación global falló.',
            },
          },
          { status: 400 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.registro, element: <Registro /> }],
        },
      ],
      RUTAS.registro,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'contraseña-segura-123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByText('El correo no está disponible.')).toBeInTheDocument()
    expect(screen.getByText('La validación global falló.')).toBeInTheDocument()
  })

  it('7C registro 409 usa el mensaje seguro del PRD', async () => {
    server.use(
      mockHttp.post('/api/users', () =>
        HttpResponse.json(
          {
            timestamp: '2026-11-22T00:00:00',
            status: 409,
            error: 'Conflict',
            message: 'username unique constraint',
            details: {},
          },
          { status: 409 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.registro, element: <Registro /> }],
        },
      ],
      RUTAS.registro,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'contraseña-segura-123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByText('El usuario o correo ya está registrado'),
    ).toBeInTheDocument()
  })

  it('TEST-FE-AUTH-005 registro 201 navega a login con aviso y state registrado', async () => {
    server.use(
      mockHttp.post('/api/users', () =>
        HttpResponse.json(
          {
            id: 42,
            username: 'ana',
            email: 'ana@example.com',
            active: true,
            firstName: 'Ana',
            lastName: 'Garcia',
            phone: null,
            city: null,
            birthDate: '2000-01-01',
          },
          { status: 201 },
        ),
      ),
    )

    const user = userEvent.setup()
    const router = createMemoryRouter(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [
            { path: RUTAS.registro, element: <Registro /> },
            { path: RUTAS.login, element: <Login /> },
          ],
        },
      ],
      { initialEntries: [RUTAS.registro] },
    )

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await user.type(screen.getByLabelText('Nombre'), 'Ana')
    await user.type(screen.getByLabelText('Apellido'), 'Garcia')
    await user.type(screen.getByLabelText('Nombre de usuario'), 'ana')
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com')
    await user.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01')
    await user.type(screen.getByLabelText('Contraseña (mínimo 12 caracteres)'), 'contraseña-segura-123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByText('Cuenta creada, inicia sesión')).toBeInTheDocument()
    expect(router.state.location.state).toMatchObject({ registrado: true })
    expect(router.state.location.pathname).toBe('/login')
  })

  it('7C indicador de fortaleza cambia al escribir contraseña', async () => {
    const user = userEvent.setup()
    renderRuta(
      [
        {
          element: <AuthProvider><Outlet /></AuthProvider>,
          children: [{ path: RUTAS.registro, element: <Registro /> }],
        },
      ],
      RUTAS.registro,
    )

    const password = screen.getByLabelText('Contraseña (mínimo 12 caracteres)')
    await user.type(password, 'a')
    expect(screen.getByText('Fortaleza: Débil')).toBeInTheDocument()

    await user.clear(password)
    await user.type(password, 'Fuerte123!Segura')
    expect(screen.getByText('Fortaleza: Fuerte')).toBeInTheDocument()
  })
})
