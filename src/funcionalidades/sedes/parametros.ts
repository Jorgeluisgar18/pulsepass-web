import { z } from 'zod'

const codigoSedeParametroSchema = z
  .string()
  .trim()
  .min(1)

export function leerCodigoSede(
  valor: string | undefined,
) {
  const resultado =
    codigoSedeParametroSchema.safeParse(
      valor,
    )

  return resultado.success
    ? resultado.data
    : null
}