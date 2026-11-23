import { Link, useParams } from 'react-router'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import DetalleEventoCabecera from '../funcionalidades/eventos/componentes/DetalleEventoCabecera'
import ListaArtistasEvento from '../funcionalidades/eventos/componentes/ListaArtistasEvento'
import PanelCompra from '../funcionalidades/eventos/componentes/PanelCompra'
import TarjetaSede from '../funcionalidades/eventos/componentes/TarjetaSede'
import { useEvento } from '../funcionalidades/eventos/hooks'
import { leerEventCode } from '../funcionalidades/eventos/parametros'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'

export default function DetalleEvento() {
  const parametros = useParams()

  const eventCode = leerEventCode(parametros.eventCode)

  const consulta = useEvento(eventCode ?? '', eventCode !== null)

  if (!eventCode) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoVacio
          titulo="Evento no disponible"
          mensaje="No pudimos encontrar el evento solicitado."
        />
      </div>
    )
  }

  if (consulta.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Cargando mensaje="Cargando detalle del evento" />
      </div>
    )
  }

  if (consulta.isError) {
    const noDisponible =
      consulta.error instanceof ApiError &&
      (consulta.error.status === 404 || consulta.error.status === 403)

    if (noDisponible) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <EstadoVacio
            titulo="Evento no disponible"
            mensaje="El evento no existe o no está disponible públicamente."
          />
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoError
          mensaje="No pudimos cargar el evento."
          onReintentar={() => {
            void consulta.refetch()
          }}
        />
      </div>
    )
  }

  if (!consulta.data) {
    return null
  }

  const evento = consulta.data

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:pb-12">
      <Link
        to={RUTAS.eventos}
        className="text-marca-600 hover:text-marca-700 focus-visible:outline-marca-600 inline-flex min-h-11 items-center rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ← Volver a la cartelera
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] md:items-start">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <DetalleEventoCabecera evento={evento} />

          <div className="space-y-8 border-t border-slate-200 p-5 sm:p-6 dark:border-slate-800">
            <ListaArtistasEvento artistas={evento.artists} />

            <TarjetaSede code={evento.venueCode} name={evento.venueName} />
          </div>
        </article>

        <PanelCompra eventCode={evento.eventCode} estado={evento.status} />
      </div>
    </div>
  )
}
