import { z } from 'zod'
import { ApiError } from './http'

export function validarRespuesta<
    TSchema extends z.ZodType,
>(
    schema: TSchema,
    datos: unknown,
): z.infer<TSchema> {
    const resultado = schema.safeParse(datos)

    if (!resultado.success) {
        throw new ApiError({
            tipo: 'respuesta-invalida',
            message:
                'La respuesta del servidor no tiene el formato esperado.',
        })
    }

    return resultado.data
}