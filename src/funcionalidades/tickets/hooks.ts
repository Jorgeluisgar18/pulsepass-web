import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '../auth/hooks'
import { eventosKeys } from '../eventos/hooks'
import {
  cancelarTicketApi,
  comprarTicketApi,
  marcarTicketUsadoApi,
  obtenerTicketApi,
  obtenerTicketsPagadosEventoApi,
  obtenerTicketsPorUsuarioApi,
} from './api'
import type { EstadoSesion } from '../auth/tipos'
import type { TipoTicket, TicketResponse } from './tipos'

export const ticketsKeys = {
  raiz: ['tickets'] as const,
  porUsuario: (email: string) => ['tickets', 'usuario', email] as const,
  detalle: (ticketCode: string, email: string) =>
    ['tickets', 'detalle', ticketCode, email] as const,
  pagadosEvento: (eventCode: string, email: string) =>
    ['tickets', 'evento', eventCode, 'pagados', email] as const,
}

function sesionAutenticada(sesion: EstadoSesion) {
  return sesion.estado === 'autenticado' ? sesion : null
}

export function useTicketsUsuario() {
  const { sesion } = useAuth()
  const autenticada = sesionAutenticada(sesion)
  const email = autenticada?.usuario.email ?? ''
  const token = autenticada?.token ?? ''

  return useQuery({
    queryKey: ticketsKeys.porUsuario(email),
    queryFn: () => obtenerTicketsPorUsuarioApi(email, token),
    enabled: Boolean(email && token),
  })
}

export function useTicketsPagadosEvento(eventCode: string) {
  const { sesion } = useAuth()
  const autenticada = sesionAutenticada(sesion)
  const email = autenticada?.usuario.email ?? ''
  const token = autenticada?.token ?? ''

  return useQuery({
    queryKey: ticketsKeys.pagadosEvento(eventCode, email),
    queryFn: () => obtenerTicketsPagadosEventoApi(eventCode, token),
    enabled: Boolean(eventCode && email && token),
  })
}

export function useTicket(ticketCode: string, habilitado = true) {
  const { sesion } = useAuth()
  const autenticada = sesionAutenticada(sesion)
  const email = autenticada?.usuario.email ?? ''
  const token = autenticada?.token ?? ''

  return useQuery({
    queryKey: ticketsKeys.detalle(ticketCode, email),
    queryFn: () => obtenerTicketApi(ticketCode, token),
    enabled: habilitado && Boolean(ticketCode && email && token),
  })
}

export function useComprarTicket(eventCode: string) {
  const { sesion } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (type: TipoTicket) => {
      const autenticada = sesionAutenticada(sesion)
      if (!autenticada) {
        throw new Error('La compra requiere una sesión autenticada.')
      }

      return comprarTicketApi(
        {
          userEmail: autenticada.usuario.email,
          eventCode,
          type,
        },
        autenticada.token,
      )
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketsKeys.raiz }),
        queryClient.invalidateQueries({ queryKey: eventosKeys.publicados }),
        queryClient.invalidateQueries({
          queryKey: eventosKeys.detalle(eventCode),
        }),
      ])
    },
  })
}

function actualizarTicketEnLista(
  tickets: TicketResponse[] | undefined,
  actualizado: TicketResponse,
) {
  return tickets?.map((ticket) =>
    ticket.id === actualizado.id ? actualizado : ticket,
  )
}

export function useCancelarTicket() {
  const { sesion } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticketCode: string) => {
      const autenticada = sesionAutenticada(sesion)
      if (!autenticada) {
        throw new Error('La cancelación requiere una sesión autenticada.')
      }

      return cancelarTicketApi(ticketCode, autenticada.token)
    },
    onSuccess: async (actualizado) => {
      queryClient.setQueryData(
        ticketsKeys.detalle(actualizado.ticketCode, actualizado.userEmail),
        actualizado,
      )
      queryClient.setQueryData<TicketResponse[]>(
        ticketsKeys.porUsuario(actualizado.userEmail),
        (tickets) => actualizarTicketEnLista(tickets, actualizado),
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketsKeys.raiz }),
        queryClient.invalidateQueries({
          queryKey: eventosKeys.publicados,
        }),
        queryClient.invalidateQueries({
          queryKey: eventosKeys.detalle(actualizado.eventCode),
        }),
      ])
    },
  })
}

export function useMarcarTicketUsado(
  alUsar?: (ticket: TicketResponse) => void,
) {
  const { sesion } = useAuth()
  const autenticada = sesionAutenticada(sesion)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ticketCode: string) => {
      if (!autenticada) {
        throw new Error('Marcar un ticket como usado requiere una sesión autenticada.')
      }

      return marcarTicketUsadoApi(ticketCode, autenticada.token)
    },
    onSuccess: async (actualizado) => {
      alUsar?.(actualizado)

      if (autenticada) {
        queryClient.setQueryData(
          ticketsKeys.detalle(actualizado.ticketCode, autenticada.usuario.email),
          actualizado,
        )
      }

      await queryClient.invalidateQueries({ queryKey: ticketsKeys.raiz })
    },
  })
}
