import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import TarjetaArtista from '../funcionalidades/artistas/componentes/TarjetaArtista'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'

export default function ListaArtistas() {
  const consulta = useArtistasActivos()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
        Artistas
      </h1>

      <div className="mt-8">
        {consulta.isLoading && <Cargando mensaje="Cargando artistas" />}

        {consulta.isError && (
          <EstadoError
            mensaje="No pudimos cargar los artistas."
            onReintentar={() => {
              void consulta.refetch()
            }}
          />
        )}

        {consulta.data && consulta.data.length === 0 && (
          <EstadoVacio
            titulo="Aún no hay artistas disponibles"
            mensaje="Los artistas activos aparecerán aquí."
          />
        )}

        {consulta.data && consulta.data.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {consulta.data.map((artista) => (
              <TarjetaArtista key={artista.id} artista={artista} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
