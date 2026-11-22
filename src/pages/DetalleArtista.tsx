import { Link, useParams } from 'react-router'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import DetalleArtistaCabecera from '../funcionalidades/artistas/componentes/DetalleArtistaCabecera'
import { useArtista } from '../funcionalidades/artistas/hooks'
import { leerArtistaId } from '../funcionalidades/artistas/parametros'
import GrillaEventos from '../funcionalidades/eventos/componentes/GrillaEventos'
import { useEventosPorArtista } from '../funcionalidades/eventos/hooks'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import NoEncontrada from './NoEncontrada'

export default function DetalleArtista() {
  const parametros = useParams()

  const artistaId = leerArtistaId(parametros.id)

  const consultaArtista = useArtista(artistaId ?? 0, artistaId !== null)

  const stageName = consultaArtista.data?.stageName ?? ''

  const consultaEventos = useEventosPorArtista(stageName, Boolean(stageName))

  if (artistaId === null) {
    return <NoEncontrada />
  }

  if (consultaArtista.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Cargando mensaje="Cargando artista" />
      </div>
    )
  }

  if (consultaArtista.isError) {
    const noEncontrado =
      consultaArtista.error instanceof ApiError &&
      consultaArtista.error.status === 404

    if (noEncontrado) {
      return <NoEncontrada />
    }

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoError
          mensaje="No pudimos cargar el artista."
          onReintentar={() => {
            void consultaArtista.refetch()
          }}
        />
      </div>
    )
  }

  if (!consultaArtista.data) {
    return null
  }

  const artista = consultaArtista.data

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to={RUTAS.artistas}
        className="text-marca-600 hover:text-marca-700 focus-visible:outline-marca-600 inline-flex min-h-11 items-center rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ← Artistas
      </Link>

      <div className="mt-4">
        <DetalleArtistaCabecera artista={artista} />
      </div>

      <section className="mt-8">
        <h2 className="font-titulo text-2xl font-bold text-slate-900 dark:text-slate-100">
          Próximos eventos de {artista.stageName}
        </h2>

        <div className="mt-6">
          {consultaEventos.isLoading && (
            <Cargando mensaje="Cargando próximos eventos" />
          )}

          {consultaEventos.isError && (
            <EstadoError
              mensaje="No pudimos cargar los próximos eventos."
              onReintentar={() => {
                void consultaEventos.refetch()
              }}
            />
          )}

          {consultaEventos.data && consultaEventos.data.length === 0 && (
            <EstadoVacio
              titulo="Sin eventos próximos"
              mensaje="No hay eventos publicados asociados a este artista."
            />
          )}

          {consultaEventos.data && consultaEventos.data.length > 0 && (
            <GrillaEventos eventos={consultaEventos.data} />
          )}
        </div>
      </section>
    </div>
  )
}
