import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import {
  ApiError,
  configurarManejadorNoAutorizado,
} from '../../lib/http'
import { queryClient } from '../../lib/queryClient'
import { RUTAS, esRutaInternaSegura } from '../../lib/rutas'
import { iniciarSesionApi, obtenerPerfilAutenticadoApi } from './api'
import { AuthContext } from './contexto'
import {
  guardarEnSessionStorage,
  leerDeSessionStorage,
  limpiarSessionStorage,
} from './sesion'
import type {
  AuthContextValor,
  CredencialesLogin,
  EstadoSesion,
  Rol,
  SesionGuardada,
} from './tipos'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)

  useLayoutEffect(() => {
    locationRef.current = location
  }, [location])
  const [sesion, setSesion] = useState<EstadoSesion>({
    estado: 'cargando',
    usuario: null,
    token: null,
  })
  const operacionRef = useRef(0)
  const tokenActivoRef = useRef<string | null>(null)
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelarTemporizador = useCallback(() => {
    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current)
      temporizadorRef.current = null
    }
  }, [])

  const cerrarSesion = useCallback((motivo?: 'expirada') => {
    operacionRef.current += 1
    tokenActivoRef.current = null
    cancelarTemporizador()
    limpiarSessionStorage()
    setSesion({
      estado: 'anonimo',
      usuario: null,
      token: null,
      ...(motivo ? { motivo } : {}),
    })
    queryClient.clear()

    if (motivo === 'expirada') {
      const location = locationRef.current
      const destino =
        location.pathname +
        location.search +
        location.hash
      const desde = esRutaInternaSegura(destino)
        ? destino
        : RUTAS.inicio

      navigate(RUTAS.login, {
        replace: true,
        state: {
          desde,
          motivo: 'expirada',
        },
      })
      return
    }

    navigate(RUTAS.inicio, { replace: true, flushSync: true })
  }, [cancelarTemporizador, navigate])

  const iniciarSesion = useCallback(async (credenciales: CredencialesLogin) => {
    const operacion = ++operacionRef.current
    cancelarTemporizador()
    tokenActivoRef.current = null

    try {
      const respuesta = await iniciarSesionApi(credenciales)
      if (operacion !== operacionRef.current) {
        throw new ApiError({
          tipo: 'respuesta-invalida',
          origen: 'login',
          message: 'La operación de inicio de sesión fue sustituida.',
        })
      }

      const expiraEn = Date.now() + respuesta.expiresIn * 1000
      const usuario = await obtenerPerfilAutenticadoApi(respuesta.accessToken)
      if (operacion !== operacionRef.current) {
        throw new ApiError({
          tipo: 'respuesta-invalida',
          origen: 'identidad',
          message: 'La operación de inicio de sesión fue sustituida.',
        })
      }

      const datosGuardar: SesionGuardada = {
        token: respuesta.accessToken,
        expiraEn,
        usuario,
      }

      guardarEnSessionStorage(datosGuardar)
      tokenActivoRef.current = respuesta.accessToken

      setSesion({
        estado: 'autenticado',
        usuario,
        token: respuesta.accessToken,
        expiraEn,
      })
    } catch (error: unknown) {
      if (operacion !== operacionRef.current) {
        throw error
      }

      tokenActivoRef.current = null
      limpiarSessionStorage()
      queryClient.clear()
      setSesion({
        estado: 'anonimo',
        usuario: null,
        token: null,
      })
      throw error
    }
  }, [cancelarTemporizador])

  const tieneRol = useCallback(
    (roles: Rol | Rol[]) => {
      if (sesion.estado !== 'autenticado') {
        return false
      }

      const rolesArray = Array.isArray(roles) ? roles : [roles]
      return rolesArray.some((rol) => sesion.usuario.roles.includes(rol))
    },
    [sesion],
  )

  useEffect(() => {
    const operacion = ++operacionRef.current
    const lectura = leerDeSessionStorage()
    const guardada = lectura.sesion

    if (!guardada) {
      queueMicrotask(() => {
        if (operacion === operacionRef.current) {
          setSesion({
            estado: 'anonimo',
            usuario: null,
            token: null,
            ...(lectura.motivo ? { motivo: lectura.motivo } : {}),
          })
        }
      })
      return
    }

    tokenActivoRef.current = guardada.token

    void obtenerPerfilAutenticadoApi(guardada.token)
      .then((usuario) => {
        if (operacion !== operacionRef.current) {
          return
        }

        setSesion({
          estado: 'autenticado',
          usuario,
          token: guardada.token,
          expiraEn: guardada.expiraEn,
        })
      })
      .catch((error: unknown) => {
        if (operacion !== operacionRef.current) {
          return
        }

        const motivo =
          error instanceof ApiError && error.status === 401
            ? 'expirada'
            : undefined

        cerrarSesion(motivo)
      })

    return () => {
      operacionRef.current += 1
      tokenActivoRef.current = null
      cancelarTemporizador()
      configurarManejadorNoAutorizado(null)
    }
  }, [cancelarTemporizador, cerrarSesion])

  useEffect(() => {
    configurarManejadorNoAutorizado((token) => {
      if (tokenActivoRef.current === token) {
        cerrarSesion('expirada')
      }
    })

    return () => {
      configurarManejadorNoAutorizado(null)
    }
  }, [cerrarSesion])

  useEffect(() => {
    if (sesion.estado !== 'autenticado') {
      return
    }

    const tiempoRestante = sesion.expiraEn - Date.now()
    cancelarTemporizador()
    temporizadorRef.current = setTimeout(() => {
      cerrarSesion('expirada')
    }, Math.max(tiempoRestante, 0))

    return () => {
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current)
        temporizadorRef.current = null
      }
    }
  }, [sesion, cerrarSesion, cancelarTemporizador])

  const valor: AuthContextValor = {
    sesion,
    iniciarSesion,
    cerrarSesion,
    tieneRol,
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}
