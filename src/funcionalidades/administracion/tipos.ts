import { z } from 'zod'
import { categoriaEventoSchema } from '../eventos/tipos'

const fechaLocalSchema = z
  .string()
  .min(1, 'La fecha y hora son obligatorias.')
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Ingresa una fecha y hora válidas.')

export const crearEventoSchema = z.object({
  eventCode: z
    .string()
    .trim()
    .min(1, 'El código del evento es obligatorio.')
    .max(255, 'El código del evento no puede exceder 255 caracteres.'),
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del evento es obligatorio.')
    .max(255, 'El nombre del evento no puede exceder 255 caracteres.'),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede exceder 1000 caracteres.')
    .transform((value) => (value.length > 0 ? value : null)),
  category: categoriaEventoSchema,
  eventDate: fechaLocalSchema,
  minimumAge: z
    .number()
    .int('La edad mínima debe ser un número entero.')
    .min(0, 'La edad mínima no puede ser negativa.'),
  venueCode: z.string().min(1, 'Selecciona una sede.'),
})

export type CrearEventoFormulario = z.input<typeof crearEventoSchema>
export type CrearEventoRequest = z.output<typeof crearEventoSchema>
