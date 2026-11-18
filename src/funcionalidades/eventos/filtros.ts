import { z } from 'zod'
import { categoriaEventoSchema } from './tipos'

export const filtrosCatalogoSchema = z.object({
    q: z.string().catch(''),
    categoria: z
        .union([
            categoriaEventoSchema,
            z.literal(''),
        ])
        .catch(''),
    artista: z.string().catch(''),
})

export type FiltrosCatalogo = z.infer<
    typeof filtrosCatalogoSchema
>

export function leerFiltrosCatalogo(
    searchParams: URLSearchParams,
): FiltrosCatalogo {
    return filtrosCatalogoSchema.parse({
        q: searchParams.get('q') ?? '',
        categoria:
            searchParams.get('categoria') ?? '',
        artista:
            searchParams.get('artista') ?? '',
    })
}