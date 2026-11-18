import {
    queryOptions,
    useQuery,
} from '@tanstack/react-query'
import {
    obtenerArtistaPorId,
    obtenerArtistaPorNombre,
    obtenerArtistasActivos,
} from './api'

export const artistasKeys = {
    activos: ['artistas', 'activos'] as const,

    detalle: (id: number) =>
        ['artista', id] as const,

    nombre: (stageName: string) =>
        ['artista', 'nombre', stageName] as const,
}

export const artistasQueries = {
    activos: () =>
        queryOptions({
            queryKey: artistasKeys.activos,
            queryFn: obtenerArtistasActivos,
            staleTime: 5 * 60_000,
        }),

    detalle: (id: number) =>
        queryOptions({
            queryKey: artistasKeys.detalle(id),
            queryFn: () =>
                obtenerArtistaPorId(id),
            staleTime: 5 * 60_000,
        }),

    nombre: (stageName: string) =>
        queryOptions({
            queryKey:
                artistasKeys.nombre(stageName),
            queryFn: () =>
                obtenerArtistaPorNombre(stageName),
            staleTime: 5 * 60_000,
        }),
}

export function useArtistasActivos() {
    return useQuery(
        artistasQueries.activos(),
    )
}

export function useArtista(id: number) {
    return useQuery(
        artistasQueries.detalle(id),
    )
}

export function useArtistaPorNombre(
    stageName: string,
) {
    return useQuery(
        artistasQueries.nombre(stageName),
    )
}