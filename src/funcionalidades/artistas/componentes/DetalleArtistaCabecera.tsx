import Badge from '../../../componentes/Badge'
import type { Artista } from '../tipos'
import AvatarInicialesArtista from './AvatarInicialesArtista'

interface DetalleArtistaCabeceraProps {
  artista: Artista
}

export default function DetalleArtistaCabecera({
  artista,
}: DetalleArtistaCabeceraProps) {
  const datosSecundarios = [artista.genre, artista.country].filter(
    (valor): valor is string => Boolean(valor),
  )

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <AvatarInicialesArtista stageName={artista.stageName} tamano="grande" />

        <div className="min-w-0">
          <h1 className="font-titulo text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {artista.stageName}
          </h1>

          {datosSecundarios.length > 0 && (
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {datosSecundarios.join(' · ')}
            </p>
          )}

          <div className="mt-3">
            <Badge tono={artista.active ? 'exito' : 'neutral'}>
              {artista.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
