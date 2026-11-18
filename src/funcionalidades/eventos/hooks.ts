import {
    queryOptions,
    useQuery,
} from '@tanstack/react-query'
import {
    obtenerEventoPorCodigo,
    obtenerEventosPorArtista,
    obtenerEventosPublicados,
} from './api'

export const eventosKeys = {
    publicados: ['eventos', 'publicados'] as const,

    detalle: (eventCode: string) =>
        ['evento', eventCode] as const,

    artista: (stageName: string) =>
        [
            'eventos',
            'artista',
            stageName,
        ] as const,
}

export const eventosQueries = {
    publicados: () =>
        queryOptions({
            queryKey: eventosKeys.publicados,
            queryFn: obtenerEventosPublicados,
            staleTime: 60_000,
        }),

    detalle: (eventCode: string) =>
        queryOptions({
            queryKey:
                eventosKeys.detalle(eventCode),
            queryFn: () =>
                obtenerEventoPorCodigo(eventCode),
            staleTime: 30_000,
        }),

    artista: (stageName: string) =>
        queryOptions({
            queryKey:
                eventosKeys.artista(stageName),
            queryFn: () =>
                obtenerEventosPorArtista(
                    stageName,
                ),
            staleTime: 60_000,
        }),
}

export function useEventosPublicados(
    enabled = true,
) {
    return useQuery({
        ...eventosQueries.publicados(),
        enabled,
    })
}

export function useEvento(
    eventCode: string,
) {
    return useQuery(
        eventosQueries.detalle(eventCode),
    )
}

export function useEventosPorArtista(
    stageName: string,
    enabled = true,
) {
    return useQuery({
        ...eventosQueries.artista(stageName),
        enabled,
    })
}