import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import TarjetaSede from '../funcionalidades/sedes/componentes/TarjetaSede'
import { useSedesActivas } from '../funcionalidades/sedes/hooks'

export default function ListaSedes() {
  const consulta = useSedesActivas()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
        Sedes
      </h1>

      <div className="mt-8">
        {consulta.isLoading && <Cargando mensaje="Cargando sedes" />}

        {consulta.isError && (
          <EstadoError
            mensaje="No pudimos cargar las sedes."
            onReintentar={() => {
              void consulta.refetch()
            }}
          />
        )}

        {consulta.data && consulta.data.length === 0 && (
          <EstadoVacio
            titulo="Aún no hay sedes disponibles"
            mensaje="Las sedes activas aparecerán aquí."
          />
        )}

        {consulta.data && consulta.data.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {consulta.data.map((sede) => (
              <TarjetaSede key={sede.id} sede={sede} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
