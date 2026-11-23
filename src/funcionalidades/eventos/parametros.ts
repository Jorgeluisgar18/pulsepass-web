import { z } from 'zod'

const eventCodeParametroSchema = z
  .string()
  .trim()
  .min(1)

export function leerEventCode(
  valor: string | undefined,
) {
  const resultado =
    eventCodeParametroSchema.safeParse(
      valor,
    )

  return resultado.success
    ? resultado.data
    : null
}