import { z } from 'zod'

const artistaIdParametroSchema = z.coerce.number().int().positive()

export function leerArtistaId(valor: string | undefined) {
  const resultado = artistaIdParametroSchema.safeParse(valor)

  return resultado.success ? resultado.data : null
}
