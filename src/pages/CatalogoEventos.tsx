import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import BarraFiltros from '../funcionalidades/eventos/componentes/BarraFiltros'
import GrillaEventos from '../funcionalidades/eventos/componentes/GrillaEventos'
import { useCatalogoEventos } from '../funcionalidades/eventos/hooksCatalogo'

export default function CatalogoEventos() {
  const {
    filtros,
    artistas,
    eventosFiltrados,
    cargando,
    hayError,
    hayFiltros,
    datosListos,
    actualizarParametro,
    limpiarFiltros,
    reintentar,
  } = useCatalogoEventos()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
          Cartelera
        </h1>
      </header>

      <div className="mb-8">
        <BarraFiltros
          q={filtros.q}
          categoria={filtros.categoria}
          artista={filtros.artista}
          artistas={artistas}
          onCambiarQ={(valor) => actualizarParametro('q', valor)}
          onCambiarCategoria={(valor) =>
            actualizarParametro('categoria', valor)
          }
          onCambiarArtista={(valor) => actualizarParametro('artista', valor)}
          onLimpiar={limpiarFiltros}
        />
      </div>

      {cargando && <Cargando mensaje="Cargando cartelera" />}

      {!cargando && hayError && (
        <EstadoError
          mensaje="No pudimos cargar la cartelera."
          onReintentar={reintentar}
        />
      )}

      {!cargando && !hayError && datosListos && (
        <>
          <p
            aria-live="polite"
            className="mb-5 text-sm text-slate-600 dark:text-slate-400"
          >
            {eventosFiltrados.length}{' '}
            {eventosFiltrados.length === 1 ? 'evento' : 'eventos'}
          </p>

          {eventosFiltrados.length === 0 ? (
            <EstadoVacio
              titulo="Sin resultados para tu búsqueda"
              mensaje={
                hayFiltros
                  ? 'Prueba con otros filtros o limpia la búsqueda.'
                  : 'Aún no hay eventos publicados.'
              }
              accion={
                hayFiltros ? (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="text-marca-600 hover:text-marca-700 focus-visible:outline-marca-600 min-h-11 rounded-lg px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-marca-300 dark:hover:text-marca-200 dark:focus-visible:outline-marca-300"
                  >
                    Limpiar filtros
                  </button>
                ) : undefined
              }
            />
          ) : (
            <GrillaEventos eventos={eventosFiltrados} />
          )}
        </>
      )}
    </section>
  )
}
