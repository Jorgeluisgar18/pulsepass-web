import { Link, useParams } from 'react-router'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import DetalleSedeInformacion from '../funcionalidades/sedes/componentes/DetalleSedeInformacion'
import { useSede } from '../funcionalidades/sedes/hooks'
import { leerCodigoSede } from '../funcionalidades/sedes/parametros'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import NoEncontrada from './NoEncontrada'

export default function DetalleSede() {
  const parametros = useParams()

  const codigo = leerCodigoSede(parametros.code)

  const consulta = useSede(codigo ?? '', codigo !== null)

  if (codigo === null) {
    return <NoEncontrada />
  }

  if (consulta.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Cargando mensaje="Cargando sede" />
      </div>
    )
  }

  if (consulta.isError) {
    const noEncontrada =
      consulta.error instanceof ApiError && consulta.error.status === 404

    if (noEncontrada) {
      return <NoEncontrada />
    }

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EstadoError
          mensaje="No pudimos cargar la sede."
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to={RUTAS.sedes}
        className="text-marca-600 hover:text-marca-700 focus-visible:outline-marca-600 inline-flex min-h-11 items-center rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-marca-300 dark:hover:text-marca-200 dark:focus-visible:outline-marca-300"
      >
        ← Sedes
      </Link>

      <div className="mx-auto mt-4 max-w-2xl">
        <DetalleSedeInformacion sede={consulta.data} />
      </div>
    </div>
  )
}
