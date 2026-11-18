import { z } from 'zod'
import { artistaSchema } from '../artistas/schemas'

export const categoriaEventoSchema = z.enum([
    'MUSIC',
    'SPORTS',
    'TECHNOLOGY',
    'EDUCATION',
    'CULTURE',
    'ENTERTAINMENT',
])

export const estadoEventoSchema = z.enum([
    'DRAFT',
    'PUBLISHED',
    'SOLD_OUT',
    'CANCELLED',
    'FINISHED',
])

const fechaHoraSchema = z
    .string()
    .min(1)
    .refine(
        (valor) =>
            !Number.isNaN(Date.parse(valor)),
        {
            message:
                'La fecha y hora recibida no son válidas',
        },
    )

export const eventoResumenSchema = z.object({
    id: z.number().int(),
    eventCode: z.string().min(1),
    name: z.string().min(1),
    category: categoriaEventoSchema,
    status: estadoEventoSchema,
    eventDate: fechaHoraSchema,
    venueCode: z.string().min(1),
    venueName: z.string().min(1),
})

export const eventosResumenSchema = z.array(
    eventoResumenSchema,
)

export const eventoSchema = z.object({
    id: z.number().int(),
    eventCode: z.string().min(1),
    name: z.string().min(1),
    description: z.string().nullable(),
    category: categoriaEventoSchema,
    status: estadoEventoSchema,
    eventDate: fechaHoraSchema,
    minimumAge: z.number().int().nullable(),
    streamingUrl: z.string().nullable(),
    venueCode: z.string().min(1),
    venueName: z.string().min(1),
    artists: z.array(artistaSchema),
})

export type CategoriaEvento = z.infer<
    typeof categoriaEventoSchema
>

export type EstadoEvento = z.infer<
    typeof estadoEventoSchema
>

export type EventoResumen = z.infer<
    typeof eventoResumenSchema
>

export type Evento = z.infer<
    typeof eventoSchema
>