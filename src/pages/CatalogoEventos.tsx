import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import { useArtistasActivos } from '../funcionalidades/artistas/hooks'
import BarraFiltros from '../funcionalidades/eventos/componentes/BarraFiltros'
import GrillaEventos from '../funcionalidades/eventos/componentes/GrillaEventos'
import {
    leerFiltrosCatalogo,
    type FiltrosCatalogo,
} from '../funcionalidades/eventos/filtros'
import {
    useEventosPorArtista,
    useEventosPublicados,
} from '../funcionalidades/eventos/hooks'

export default function CatalogoEventos() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams()

    const filtros =
        leerFiltrosCatalogo(searchParams)

    const consultaPublicados =
        useEventosPublicados(
            !filtros.artista,
        )

    const consultaPorArtista =
        useEventosPorArtista(
            filtros.artista,
            Boolean(filtros.artista),
        )

    const consultaArtistas =
        useArtistasActivos()

    const consultaEventos =
        filtros.artista
            ? consultaPorArtista
            : consultaPublicados

    const hayFiltros = Boolean(
        filtros.q ||
        filtros.categoria ||
        filtros.artista,
    )

    const eventosFiltrados = useMemo(() => {
        const eventos =
            consultaEventos.data ?? []

        const texto = filtros.q
            .trim()
            .toLocaleLowerCase('es-CO')

        return eventos.filter((evento) => {
            const coincideTexto =
                !texto ||
                evento.name
                    .toLocaleLowerCase('es-CO')
                    .includes(texto)

            const coincideCategoria =
                !filtros.categoria ||
                evento.category ===
                filtros.categoria

            return (
                coincideTexto &&
                coincideCategoria
            )
        })
    }, [
        consultaEventos.data,
        filtros.q,
        filtros.categoria,
    ])

    function actualizarParametro(
        clave: keyof FiltrosCatalogo,
        valor: string,
    ) {
        const siguientes =
            new URLSearchParams(searchParams)

        if (valor.trim()) {
            siguientes.set(clave, valor)
        } else {
            siguientes.delete(clave)
        }

        setSearchParams(siguientes, {
            replace: true,
        })
    }

    function limpiarFiltros() {
        setSearchParams(
            {},
            {
                replace: true,
            },
        )
    }

    function reintentar() {
        void consultaEventos.refetch()

        if (consultaArtistas.isError) {
            void consultaArtistas.refetch()
        }
    }

    const cargando =
        consultaEventos.isLoading ||
        consultaArtistas.isLoading

    const hayError =
        consultaEventos.isError ||
        consultaArtistas.isError

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
                    artistas={
                        consultaArtistas.data ?? []
                    }
                    onCambiarQ={(valor) =>
                        actualizarParametro(
                            'q',
                            valor,
                        )
                    }
                    onCambiarCategoria={(valor) =>
                        actualizarParametro(
                            'categoria',
                            valor,
                        )
                    }
                    onCambiarArtista={(valor) =>
                        actualizarParametro(
                            'artista',
                            valor,
                        )
                    }
                    onLimpiar={limpiarFiltros}
                />
            </div>

            {cargando && (
                <Cargando mensaje="Cargando cartelera" />
            )}

            {!cargando && hayError && (
                <EstadoError
                    mensaje="No pudimos cargar la cartelera."
                    onReintentar={reintentar}
                />
            )}

            {!cargando &&
                !hayError &&
                consultaEventos.data && (
                    <>
                        <p
                            aria-live="polite"
                            className="mb-5 text-sm text-slate-600 dark:text-slate-400"
                        >
                            {eventosFiltrados.length}{' '}
                            {eventosFiltrados.length === 1
                                ? 'evento'
                                : 'eventos'}
                        </p>

                        {eventosFiltrados.length ===
                        0 ? (
                            hayFiltros ? (
                                <EstadoVacio
                                    titulo="Sin resultados para tu búsqueda"
                                    mensaje="Prueba con otros filtros o limpia la búsqueda."
                                    accion={
                                        <button
                                            type="button"
                                            onClick={limpiarFiltros}
                                            className="min-h-11 rounded-lg px-4 py-2 font-semibold text-marca-600 hover:text-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                                        >
                                            Limpiar filtros
                                        </button>
                                    }
                                />
                            ) : (
                                <EstadoVacio
                                    titulo="Aún no hay eventos publicados"
                                    mensaje="Cuando haya nuevos eventos disponibles aparecerán aquí."
                                />
                            )
                        ) : (
                            <GrillaEventos
                                eventos={eventosFiltrados}
                            />
                        )}
                    </>
                )}
        </section>
    )
}