import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './http'

function debeReintentarConsulta(
    failureCount: number,
    error: unknown,
) {
    if (failureCount >= 1) {
        return false
    }

    if (!(error instanceof ApiError)) {
        return false
    }

    if (error.tipo === 'red') {
        return true
    }

    return (
        error.tipo === 'http' &&
        error.status !== null &&
        error.status >= 500
    )
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: debeReintentarConsulta,
        },
        mutations: {
            retry: false,
        },
    },
})