import { Link } from 'react-router'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import AvatarArtista from '../funcionalidades/artistas/componentes/AvatarArtista'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import TarjetaEvento from '../funcionalidades/eventos/componentes/TarjetaEvento'
import { useEventosPublicados } from '../funcionalidades/eventos/hooks'
import { RUTAS } from '../lib/rutas'

export default function Inicio() {
    const eventos = useEventosPublicados()
    const artistas = useArtistasActivos()

    const hayError =
        eventos.isError || artistas.isError

    const cargando =
        eventos.isLoading ||
        artistas.isLoading

    function reintentar() {
        void eventos.refetch()
        void artistas.refetch()
    }

    return (
        <>
            <section className="bg-linear-to-r from-marca-600 to-acento-500 text-white">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/80">
                        Eventos · artistas · entradas
                    </p>

                    <h1 className="font-titulo max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Descubre los mejores eventos
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
                        Música, cultura, deporte y
                        tecnología en un solo lugar.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={RUTAS.eventos}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-marca-700 transition hover:bg-marca-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Ver cartelera
                        </Link>

                        <Link
                            to={RUTAS.registro}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Crear cuenta
                        </Link>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
                {cargando && (
                    <section aria-label="Cargando contenido">
                        <Cargando mensaje="Cargando eventos y artistas" />
                    </section>
                )}

                {!cargando && hayError && (
                    <EstadoError
                        mensaje="No pudimos cargar el contenido de inicio."
                        onReintentar={reintentar}
                    />
                )}

                {!cargando &&
                    !hayError &&
                    eventos.data &&
                    artistas.data && (
                        <>
                            <section>
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <h2 className="font-titulo text-2xl font-bold">
                                        Próximos eventos
                                    </h2>

                                    <Link
                                        to={RUTAS.eventos}
                                        className="rounded text-sm font-semibold text-marca-600 hover:text-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-marca-300 dark:hover:text-marca-200 dark:focus-visible:outline-marca-300"
                                    >
                                        Ver todos →
                                    </Link>
                                </div>

                                {eventos.data.length ===
                                0 ? (
                                    <EstadoVacio
                                        titulo="Aún no hay eventos publicados"
                                        mensaje="Cuando haya nuevos eventos disponibles aparecerán aquí."
                                        accion={
                                            <Link
                                                to={RUTAS.eventos}
                                                className="font-semibold text-marca-600 dark:text-marca-300"
                                            >
                                                Ir a cartelera
                                            </Link>
                                        }
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {eventos.data
                                            .slice(0, 3)
                                            .map((evento) => (
                                                <TarjetaEvento
                                                    key={
                                                        evento.eventCode
                                                    }
                                                    evento={evento}
                                                />
                                            ))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <h2 className="font-titulo text-2xl font-bold">
                                        Artistas destacados
                                    </h2>

                                    <Link
                                        to={RUTAS.artistas}
                                        className="rounded text-sm font-semibold text-marca-600 hover:text-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:text-marca-300 dark:hover:text-marca-200 dark:focus-visible:outline-marca-300"
                                    >
                                        Ver todos →
                                    </Link>
                                </div>

                                {artistas.data.length ===
                                0 ? (
                                    <EstadoVacio
                                        titulo="Aún no hay artistas disponibles"
                                        mensaje="Los artistas activos aparecerán aquí."
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {artistas.data
                                            .slice(0, 6)
                                            .map((artista) => (
                                                <AvatarArtista
                                                    key={artista.id}
                                                    artista={artista}
                                                />
                                            ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
            </div>
        </>
    )
}