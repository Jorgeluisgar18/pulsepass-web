import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useArtistaPorNombre, useArtistasActivos } from '../artistas/hooks'
import { leerFiltrosCatalogo, type FiltrosCatalogo } from './filtros'
import { useEventosPorArtista, useEventosPublicados } from './hooks'

export function useCatalogoEventos() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filtros = leerFiltrosCatalogo(searchParams)

  const tieneArtista = Boolean(filtros.artista)

  const consultaPublicados = useEventosPublicados(!tieneArtista)

  const consultaArtista = useArtistaPorNombre(filtros.artista, tieneArtista)

  const stageName = consultaArtista.data?.stageName ?? ''

  const consultaPorArtista = useEventosPorArtista(stageName, Boolean(stageName))

  const consultaArtistas = useArtistasActivos()

  const consultaEventos = tieneArtista ? consultaPorArtista : consultaPublicados

  const eventosFiltrados = useMemo(() => {
    const eventos = consultaEventos.data ?? []

    const texto = filtros.q.trim().toLocaleLowerCase('es-CO')

    return eventos.filter((evento) => {
      const coincideTexto =
        !texto || evento.name.toLocaleLowerCase('es-CO').includes(texto)

      const coincideCategoria =
        !filtros.categoria || evento.category === filtros.categoria

      return coincideTexto && coincideCategoria
    })
  }, [consultaEventos.data, filtros.q, filtros.categoria])

  function actualizarParametro(clave: keyof FiltrosCatalogo, valor: string) {
    const siguientes = new URLSearchParams(searchParams)

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
    if (consultaEventos.isError) {
      void consultaEventos.refetch()
    }

    if (consultaArtistas.isError) {
      void consultaArtistas.refetch()
    }

    if (consultaArtista.isError) {
      void consultaArtista.refetch()
    }
  }

  const cargando =
    consultaEventos.isLoading ||
    consultaArtistas.isLoading ||
    (tieneArtista && consultaArtista.isLoading)

  const hayError =
    consultaEventos.isError ||
    consultaArtistas.isError ||
    (tieneArtista && consultaArtista.isError)

  return {
    filtros,
    artistas: consultaArtistas.data ?? [],
    eventosFiltrados,
    cargando,
    hayError,
    hayFiltros: Boolean(filtros.q || filtros.categoria || filtros.artista),
    datosListos: consultaEventos.data !== undefined,
    actualizarParametro,
    limpiarFiltros,
    reintentar,
  }
}
