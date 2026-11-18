import {
    queryOptions,
    useQuery,
} from '@tanstack/react-query'
import {
    obtenerSedePorCodigo,
    obtenerSedesActivas,
} from './api'

export const sedesKeys = {
    activas: ['sedes', 'activas'] as const,

    detalle: (code: string) =>
        ['sede', code] as const,
}

export const sedesQueries = {
    activas: () =>
        queryOptions({
            queryKey: sedesKeys.activas,
            queryFn: obtenerSedesActivas,
            staleTime: 5 * 60_000,
        }),

    detalle: (code: string) =>
        queryOptions({
            queryKey: sedesKeys.detalle(code),
            queryFn: () =>
                obtenerSedePorCodigo(code),
            staleTime: 5 * 60_000,
        }),
}

export function useSedesActivas() {
    return useQuery(
        sedesQueries.activas(),
    )
}

export function useSede(code: string) {
    return useQuery(
        sedesQueries.detalle(code),
    )
}