import { z } from 'zod'

export const tipoTicketSchema = z.enum([
  'GENERAL',
  'VIP',
  'BACKSTAGE',
  'STUDENT',
])

export const estadoTicketSchema = z.enum([
  'RESERVED',
  'PAID',
  'CANCELLED',
  'USED',
])

const fechaCompraSchema = z
  .string()
  .min(1)
  .refine((valor) => !Number.isNaN(Date.parse(valor)))

export const ticketSchema = z.object({
  id: z.number().int(),
  ticketCode: z.string().min(1),
  type: tipoTicketSchema,
  price: z.number().finite().nonnegative(),
  status: estadoTicketSchema,
  purchaseDate: fechaCompraSchema,
  userEmail: z.string().email(),
  eventCode: z.string().min(1),
  eventName: z.string().min(1),
})

export const ticketsSchema = z.array(ticketSchema)

export const solicitudCompraTicketSchema = z.object({
  userEmail: z.string().email(),
  eventCode: z.string().min(1),
  type: tipoTicketSchema,
})

export const seleccionTipoTicketSchema = z.object({
  type: tipoTicketSchema,
})

export type TipoTicket = z.infer<typeof tipoTicketSchema>
export type EstadoTicket = z.infer<typeof estadoTicketSchema>
export type TicketResponse = z.infer<typeof ticketSchema>
export type SolicitudCompraTicket = z.infer<
  typeof solicitudCompraTicketSchema
>
export type SeleccionTipoTicket = z.infer<typeof seleccionTipoTicketSchema>
