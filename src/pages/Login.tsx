import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm, type Path } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import EncabezadoAuth from '../funcionalidades/auth/componentes/EncabezadoAuth'
import { useAuth } from '../funcionalidades/auth/hooks'
import {
  credencialesLoginSchema,
  type CredencialesLogin,
} from '../funcionalidades/auth/tipos'
import { ApiError } from '../lib/http'
import { RUTAS, esRutaInternaSegura } from '../lib/rutas'

interface EstadoUbicacion {
  desde?: string
  registroExitoso?: boolean
  registrado?: boolean
  motivo?: 'expirada'
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { iniciarSesion } = useAuth()
  const state = location.state as EstadoUbicacion | null

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)
  const montadoRef = useRef(true)

  useEffect(() => {
    montadoRef.current = true
    return () => { montadoRef.current = false }
  }, [])

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CredencialesLogin>({
    resolver: zodResolver(credencialesLoginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  async function alEnviar(datos: CredencialesLogin) {
    setErrorGlobal(null)
    try {
      await iniciarSesion(datos)
      if (!montadoRef.current) return
      const destino = esRutaInternaSegura(state?.desde) &&
        state.desde !== RUTAS.login &&
        state.desde !== RUTAS.registro
        ? state.desde
        : RUTAS.inicio
      navigate(destino, { replace: true })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.origen === 'login' && error.status === 401) {
          setErrorGlobal('Credenciales inválidas')
          return
        }

        if (error.origen === 'identidad') {
          setErrorGlobal(
            'No pudimos validar tu sesión. Intenta iniciar sesión nuevamente.',
          )
          return
        }

        if (error.status === 400) {
          const conocidos = new Set(['identifier', 'password'])
          const desconocidos: string[] = []
          let primerCampo: Path<CredencialesLogin> | null = null

          for (const [campo, mensaje] of Object.entries(error.details)) {
            if (conocidos.has(campo)) {
              const campoConocido = campo as Path<CredencialesLogin>
              setError(campoConocido, {
                type: 'server',
                message: mensaje,
              })
              primerCampo ??= campoConocido
            } else {
              desconocidos.push(mensaje)
            }
          }

          setErrorGlobal(
            desconocidos.length > 0
              ? desconocidos.join(' ')
              : error.message,
          )

          if (primerCampo) {
            setFocus(primerCampo)
          }
          return
        }

        if (error.status !== null && error.status >= 500) {
          setErrorGlobal(
            'No pudimos procesar el inicio de sesión. Inténtalo de nuevo.',
          )
          return
        }
      }

      if (error instanceof ApiError) {
        setErrorGlobal(error.message)
        return
      }

      setErrorGlobal('Ocurrió un error al intentar iniciar sesión.')
    }
  }

  function alErrorValidacion() {
    if (errors.identifier) {
      setFocus('identifier')
      return
    }

    if (errors.password) {
      setFocus('password')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <EncabezadoAuth titulo="Inicia sesión" />

        {(state?.registroExitoso || state?.registrado) && !errorGlobal && (
          <div className="mb-6">
            <Aviso tipo="exito">
              Cuenta creada, inicia sesión
            </Aviso>
          </div>
        )}

        {state?.motivo === 'expirada' && !errorGlobal && (
          <div className="mb-6">
            <Aviso tipo="advertencia">Tu sesión expiró</Aviso>
          </div>
        )}

        {errorGlobal && (
          <div className="mb-6">
            <Aviso tipo="error">{errorGlobal}</Aviso>
          </div>
        )}

        <form onSubmit={(event) => { void handleSubmit(alEnviar, alErrorValidacion)(event) }} noValidate className="space-y-5">
          <Campo
            etiqueta="Usuario o correo electrónico"
            autoComplete="username"
            spellCheck={false}
            error={errors.identifier?.message}
            {...register('identifier')}
          />

          <div className="space-y-2">
            <div className="relative">
              <Campo
                etiqueta="Contraseña"
                type={mostrarPassword ? 'text' : 'password'}
                autoComplete="current-password"
                spellCheck={false}
                className="pr-14"
                error={errors.password?.message}
                {...register('password')}
              />

              <button
                type="button"
                aria-label={
                  mostrarPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                onClick={() => setMostrarPassword((prev) => !prev)}
                aria-pressed={mostrarPassword}
                className="absolute right-0 top-7 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-slate-400 dark:hover:text-slate-200 dark:focus-visible:outline-marca-300"
              >
                {mostrarPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Boton
              type="submit"
              variante="primario"
              cargando={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              Ingresar
            </Boton>
          </div>
        </form>

        <footer className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <Link
            to={RUTAS.registro}
            className="font-semibold text-marca-600 hover:text-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-marca-400 dark:hover:text-marca-200 dark:focus-visible:outline-marca-300"
          >
            Regístrate
          </Link>
        </footer>
      </div>
    </div>
  )
}
