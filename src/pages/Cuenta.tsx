import { useState } from 'react'
import Badge from '../componentes/Badge'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import { Link } from 'react-router'
import {
  useAuth,
  useMiPerfil,
  useUsuarioPorUsername,
} from '../funcionalidades/auth/hooks'
import { RUTAS } from '../lib/rutas'

export default function Cuenta() {
  const { sesion, cerrarSesion, tieneRol } = useAuth()
  const [metodoConsulta, setMetodoConsulta] = useState<'email' | 'username'>(
    'email',
  )
  const perfilPorEmail = useMiPerfil(metodoConsulta === 'email')
  const perfilPorUsername = useUsuarioPorUsername(
    metodoConsulta === 'username',
  )
  const consultaPerfil =
    metodoConsulta === 'email' ? perfilPorEmail : perfilPorUsername
  const { data: perfil, isLoading, isError, refetch } = consultaPerfil

  if (sesion.estado !== 'autenticado') {
    return null
  }

  const usuarioSesion = sesion.usuario
  const nombreCompleto = `${perfil?.firstName ?? ''} ${perfil?.lastName ?? ''}`.trim()
  const inicial = perfil?.firstName?.charAt(0).toUpperCase() ||
    usuarioSesion.username.charAt(0).toUpperCase()

  function formatearNacimiento(valor: string) {
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor)
    if (!coincidencia) {
      return valor
    }

    const [, anio, mes, dia] = coincidencia
    return `${dia}/${mes}/${anio}`
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-titulo text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Mi cuenta
      </h1>

      <button
        type="button"
        onClick={() => {
          setMetodoConsulta((actual) =>
            actual === 'email' ? 'username' : 'email',
          )
        }}
        className="mt-2 min-h-11 text-left text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-slate-400 dark:decoration-slate-600 dark:hover:text-slate-200"
      >
        {metodoConsulta === 'email'
          ? 'Consultar por nombre de usuario'
          : 'Consultar por correo electrónico'}
      </button>

      {isLoading && (
        <div className="py-12">
          <Cargando mensaje="Cargando información de tu cuenta…" />
        </div>
      )}

      {isError && (
        <div className="py-8">
          <EstadoError
            mensaje="No pudimos cargar la información de tu cuenta."
            onReintentar={() => {
              void refetch()
            }}
          />
        </div>
      )}

      {!isLoading && !isError && perfil && (
        <section className="mt-6 space-y-5" aria-labelledby="titulo-perfil">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-marca-100 text-2xl font-bold text-marca-700 dark:bg-marca-900 dark:text-marca-300"
                >
                  {inicial}
                </span>

                <div className="min-w-0">
                  <h2
                    id="titulo-perfil"
                    className="font-titulo text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100"
                  >
                    {nombreCompleto}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    @{perfil.username}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {perfil.email}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Nacimiento: {formatearNacimiento(perfil.birthDate)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Rol:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {usuarioSesion.roles.map((rol) => (
                      <Badge key={rol} tono="info">
                        {rol}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Estado:
                  </span>
                  <Badge tono={perfil.active ? 'exito' : 'error'}>
                    {perfil.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {tieneRol('USER') ? (
              <Link
                to={RUTAS.misTickets}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-marca-600 px-4 py-2 font-semibold text-white transition hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M7 9h10M7 13h6" />
                </svg>
                Ver mis tickets
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            <button
              type="button"
              onClick={() => cerrarSesion()}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Cerrar sesión
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
