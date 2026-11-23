import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Badge from '../componentes/Badge'
import Boton from '../componentes/Boton'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import Modal from '../componentes/Modal'
import {
  useAdminEvento,
  useArtistasActivosAdmin,
  useAsociarArtistaAdmin,
  usePublicarEventoAdmin,
} from '../funcionalidades/administracion/hooks'
import { mensajeErrorAdmin } from '../funcionalidades/administracion/errores'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import type { EstadoEvento } from '../funcionalidades/eventos/tipos'

const etiquetasEstado: Record<EstadoEvento, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  SOLD_OUT: 'Agotado',
  CANCELLED: 'Cancelado',
  FINISHED: 'Finalizado',
}

const etiquetasCategoria: Record<string, string> = {
  MUSIC: 'Música',
  SPORTS: 'Deportes',
  TECHNOLOGY: 'Tecnología',
  EDUCATION: 'Educación',
  CULTURE: 'Cultura',
  ENTERTAINMENT: 'Entretenimiento',
}

export default function AdminGestionEvento() {
  const { eventCode = '' } = useParams()
  const consultaEvento = useAdminEvento(eventCode)
  const artistas = useArtistasActivosAdmin()
  const publicar = usePublicarEventoAdmin(eventCode)
  const asociar = useAsociarArtistaAdmin(eventCode)
  const [confirmarPublicacion, setConfirmarPublicacion] = useState(false)
  const [artistId, setArtistId] = useState('')
  const evento = consultaEvento.data
  const errorEvento404 = consultaEvento.error instanceof ApiError && consultaEvento.error.status === 404

  async function publicarEvento() {
    try {
      await publicar.mutateAsync()
      setConfirmarPublicacion(false)
    } catch {
      // The mutation error remains visible in the confirmation dialog.
    }
  }

  async function asociarArtista() {
    const id = Number(artistId)
    if (!Number.isSafeInteger(id) || id <= 0) return

    try {
      await asociar.mutateAsync(id)
      setArtistId('')
    } catch {
      // Keep the selected artist so the ADMIN can review or retry the request.
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-marca-600">PulsePass</p>
          <h1 className="mt-2 font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
            Gestionar evento
          </h1>
          <p className="mt-3 break-all text-slate-600 dark:text-slate-400">Código: {eventCode}</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            to={RUTAS.adminEventos}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Volver a eventos
          </Link>
          {evento && (
            <Link
              to={RUTAS.staffTicketsEvento(evento.eventCode)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Ver tickets pagados
            </Link>
          )}
        </div>
      </header>

      {consultaEvento.isPending && <Cargando mensaje="Cargando información privada del evento…" />}
      {consultaEvento.isError && errorEvento404 && (
        <EstadoVacio
          titulo="Evento no encontrado"
          mensaje="No encontramos un evento disponible para gestionar con ese código."
          accion={(
            <Link to={RUTAS.adminEventos} className="font-semibold text-marca-700 underline dark:text-marca-300">
              Volver a buscar eventos
            </Link>
          )}
        />
      )}
      {consultaEvento.isError && !errorEvento404 && (
        <EstadoError
          mensaje={mensajeErrorAdmin(consultaEvento.error, 'No pudimos cargar el evento.')}
          onReintentar={() => void consultaEvento.refetch()}
        />
      )}

      {evento && (
        <>
          <section
            aria-labelledby="evento-admin-titulo"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{evento.eventCode}</p>
                <h2 id="evento-admin-titulo" className="mt-1 font-titulo text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {evento.name}
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {evento.description || 'Sin descripción.'}
                </p>
              </div>
              <Badge tono={evento.status === 'PUBLISHED' ? 'exito' : evento.status === 'CANCELLED' ? 'error' : 'neutral'}>
                {etiquetasEstado[evento.status]}
              </Badge>
            </div>

            <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-5 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Categoría</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {etiquetasCategoria[evento.category] ?? evento.category}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Fecha y hora</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {evento.eventDate.replace('T', ' ')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Edad mínima</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {evento.minimumAge === null ? 'Sin restricción' : `${evento.minimumAge} años`}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Sede</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {evento.venueName} ({evento.venueCode})
                </dd>
              </div>
            </dl>

            {evento.status === 'DRAFT' && (
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                <Boton
                  onClick={() => {
                    publicar.reset()
                    setConfirmarPublicacion(true)
                  }}
                  disabled={publicar.isPending}
                >
                  Publicar evento
                </Boton>
              </div>
            )}
          </section>

          <section
            aria-labelledby="artistas-asociados-titulo"
            className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]"
          >
            <div>
              <h2 id="artistas-asociados-titulo" className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
                Artistas asociados
              </h2>
              {evento.artists.length === 0 ? (
                <EstadoVacio
                  titulo="Todavía no hay artistas asociados."
                  mensaje="Asocia un artista activo para mostrarlo en el evento."
                />
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {evento.artists.map((artista) => (
                    <li key={artista.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{artista.stageName}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {[artista.genre, artista.country].filter(Boolean).join(' · ') || 'Sin género ni país informado'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
                Asociar artista activo
              </h2>
              {artistas.isPending && <Cargando mensaje="Cargando artistas activos…" />}
              {artistas.isError && (
                <EstadoError
                  mensaje={mensajeErrorAdmin(artistas.error, 'No pudimos cargar los artistas activos.')}
                  onReintentar={() => void artistas.refetch()}
                />
              )}
              {!artistas.isPending && !artistas.isError && artistas.data.length === 0 && (
                <EstadoVacio titulo="No hay artistas activos disponibles." />
              )}
              {!artistas.isPending && !artistas.isError && artistas.data.length > 0 && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="artistId" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Artista activo
                    </label>
                    <select
                      id="artistId"
                      value={artistId}
                      onChange={(event) => {
                        setArtistId(event.target.value)
                        asociar.reset()
                      }}
                      disabled={asociar.isPending}
                      className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value="">Selecciona un artista</option>
                      {artistas.data.map((artista) => (
                        <option key={artista.id} value={artista.id}>{artista.stageName}</option>
                      ))}
                    </select>
                  </div>
                  {asociar.error && (
                    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                      {mensajeErrorAdmin(asociar.error, 'No pudimos asociar al artista.')}
                    </div>
                  )}
                  <Boton
                    onClick={() => void asociarArtista()}
                    disabled={!artistId || asociar.isPending}
                    cargando={asociar.isPending}
                  >
                    Asociar artista
                  </Boton>
                </>
              )}
            </div>
          </section>
        </>
      )}

      {evento?.status === 'DRAFT' && (
        <Modal
          abierto={confirmarPublicacion}
          titulo="Publicar evento"
          onCerrar={() => {
            if (!publicar.isPending) setConfirmarPublicacion(false)
          }}
        >
          <p className="text-slate-700 dark:text-slate-300">
            Esta acción hará público el evento <strong>{evento.name}</strong>.
          </p>
          {publicar.error && (
            <div role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              {mensajeErrorAdmin(publicar.error, 'No pudimos publicar el evento.')}
            </div>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Boton
              variante="secundario"
              onClick={() => setConfirmarPublicacion(false)}
              disabled={publicar.isPending}
            >
              Cancelar
            </Boton>
            <Boton onClick={() => void publicarEvento()} cargando={publicar.isPending}>
              Confirmar publicación
            </Boton>
          </div>
        </Modal>
      )}
    </div>
  )
}
