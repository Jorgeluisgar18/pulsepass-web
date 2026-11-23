import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch, type Path } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import Aviso from '../componentes/Aviso'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import EncabezadoAuth from '../funcionalidades/auth/componentes/EncabezadoAuth'
import { registrarUsuarioApi } from '../funcionalidades/auth/api'
import {
  registroUsuarioSchema,
  type DatosRegistro,
} from '../funcionalidades/auth/tipos'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'

export default function Registro() {
  const navigate = useNavigate()
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DatosRegistro>({
    resolver: zodResolver(registroUsuarioSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      birthDate: '',
      password: '',
    },
  })

  const password = useWatch({ control, name: 'password' }) ?? ''
  const bytesPassword = new TextEncoder().encode(password).length
  const fortalezaPassword =
    bytesPassword === 0
      ? 'Sin contraseña'
      : bytesPassword < 12
        ? 'Débil'
        : /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[^A-Za-z0-9]/.test(password) &&
            bytesPassword >= 16
          ? 'Fuerte'
          : 'Media'

  async function alEnviar(datos: DatosRegistro) {
    setErrorGlobal(null)
    try {
      await registrarUsuarioApi(datos)
      navigate(RUTAS.login, {
        replace: true,
        state: { registrado: true },
      })
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          const conocidos = new Set([
            'username',
            'email',
            'firstName',
            'lastName',
            'birthDate',
            'password',
            'phone',
            'city',
          ])
          const desconocidos: string[] = []
          let primerCampo: Path<DatosRegistro> | null = null

          for (const [campo, mensaje] of Object.entries(error.details)) {
            if (conocidos.has(campo)) {
              const campoConocido = campo as Path<DatosRegistro>
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
              : Object.keys(error.details).length === 0
                ? error.message
                : null,
          )

          if (primerCampo) {
            setFocus(primerCampo)
          }
          return
        }

        if (error.status === 409) {
          setErrorGlobal('El usuario o correo ya está registrado')
          return
        }

        if (error.status !== null && error.status >= 500) {
          setErrorGlobal(
            'No pudimos crear la cuenta. Inténtalo de nuevo.',
          )
          return
        }

        setErrorGlobal(error.message)
        return
      }

      setErrorGlobal('Ocurrió un error inesperado al registrar la cuenta.')
    }
  }

  function alErrorValidacion() {
    if (errors.username) {
      setFocus('username')
      return
    }
    if (errors.email) {
      setFocus('email')
      return
    }
    if (errors.firstName) {
      setFocus('firstName')
      return
    }
    if (errors.lastName) {
      setFocus('lastName')
      return
    }
    if (errors.birthDate) {
      setFocus('birthDate')
      return
    }
    if (errors.password) {
      setFocus('password')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <EncabezadoAuth titulo="Crea tu cuenta" />

        {errorGlobal && (
          <div className="mb-6">
            <Aviso tipo="error">{errorGlobal}</Aviso>
          </div>
        )}

        <form onSubmit={handleSubmit(alEnviar, alErrorValidacion)} noValidate className="space-y-5">
          <Campo
            etiqueta="Nombre de usuario"
            autoComplete="username"
            spellCheck={false}
            error={errors.username?.message}
            {...register('username')}
          />

          <Campo
            etiqueta="Correo electrónico"
            type="email"
            autoComplete="email"
            spellCheck={false}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Campo
              etiqueta="Nombre"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />

            <Campo
              etiqueta="Apellido"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Campo
            etiqueta="Fecha de nacimiento"
            type="date"
            className="[color-scheme:light] dark:[color-scheme:dark]"
            error={errors.birthDate?.message}
            {...register('birthDate')}
          />

          <div className="space-y-2">
            <div className="relative">
              <Campo
                etiqueta="Contraseña (mínimo 12 caracteres)"
                type={mostrarPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
                className="absolute right-0 top-7 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-slate-400 dark:hover:text-slate-200"
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
            <meter
              aria-label="Fortaleza de la contraseña"
              min={0}
              max={3}
              low={1}
              high={2}
              optimum={3}
              value={password.length === 0 ? 0 : fortalezaPassword === 'Fuerte' ? 3 : fortalezaPassword === 'Media' ? 2 : 1}
              className="h-2 w-full"
            />
            {password.length > 0 && (
              <p
                className={
                  fortalezaPassword === 'Fuerte'
                    ? 'text-sm font-medium text-emerald-700 dark:text-emerald-400'
                    : fortalezaPassword === 'Media'
                      ? 'text-sm font-medium text-amber-700 dark:text-amber-400'
                      : 'text-sm font-medium text-red-700 dark:text-red-400'
                }
                aria-live="polite"
              >
                Fortaleza: {fortalezaPassword}
              </p>
            )}
          </div>

          <details open={errors.phone || errors.city ? true : undefined} className="text-sm text-slate-600 dark:text-slate-300">
            <summary className="min-h-11 cursor-pointer rounded-lg py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600">
              Datos de contacto (opcional)
            </summary>
            <div className="mt-3 space-y-5">
              <Campo etiqueta="Teléfono (opcional)" type="tel" autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
              <Campo etiqueta="Ciudad (opcional)" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
            </div>
          </details>

          <div className="pt-2">
            <Boton
              type="submit"
              variante="primario"
              cargando={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              Crear cuenta
            </Boton>
          </div>
        </form>

        <footer className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to={RUTAS.login}
            className="font-semibold text-marca-600 hover:text-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-marca-400"
          >
            Inicia sesión
          </Link>
        </footer>
      </div>
    </div>
  )
}
