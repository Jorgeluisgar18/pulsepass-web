import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/hooks'
import { useArtistasActivos } from '../artistas/hooks'
import type { Evento } from '../eventos/tipos'
import { eventosKeys } from '../eventos/hooks'
import { useSedesActivas } from '../sedes/hooks'
import {
  asociarArtistaApi,
  crearEventoApi,
  obtenerEventoAdmin,
  publicarEventoApi,
} from './api'
import type { CrearEventoRequest } from './tipos'

export const adminEventosKeys = {
  buscar: (userId: number, eventCode: string) =>
    ['admin', 'buscar-evento', userId, eventCode] as const,
  evento: (userId: number, eventCode: string) =>
    ['admin', 'evento', userId, eventCode] as const,
  creados: (userId: number) => ['admin', 'creados', userId] as const,
  sedes: ['admin', 'sedes-activas'] as const,
}

function conservarRelacionDeSesion(queryClient: ReturnType<typeof useQueryClient>, userId: number) {
  const queryKey = adminEventosKeys.creados(userId)
  queryClient.setQueryDefaults(queryKey, {
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

function agregarEventoCreado(queryClient: ReturnType<typeof useQueryClient>, evento: Evento, userId: number) {
  const queryKey = adminEventosKeys.creados(userId)
  conservarRelacionDeSesion(queryClient, userId)
  queryClient.setQueryData<Evento[]>(queryKey, (eventos = []) => [
    evento,
    ...eventos.filter((actual) => actual.eventCode !== evento.eventCode),
  ])
}

function actualizarEventoCreadoSiExiste(
  queryClient: ReturnType<typeof useQueryClient>,
  evento: Evento,
  userId: number,
) {
  const queryKey = adminEventosKeys.creados(userId)
  const eventos = queryClient.getQueryData<Evento[]>(queryKey)
  if (!eventos?.some((actual) => actual.eventCode === evento.eventCode)) return

  queryClient.setQueryData<Evento[]>(
    queryKey,
    eventos.map((actual) => (actual.eventCode === evento.eventCode ? evento : actual)),
  )
}

async function actualizarCachesEvento(
  queryClient: ReturnType<typeof useQueryClient>,
  evento: Evento,
  userId: number,
) {
  queryClient.setQueryData(adminEventosKeys.evento(userId, evento.eventCode), evento)
  actualizarEventoCreadoSiExiste(queryClient, evento, userId)
  if (evento.status === 'PUBLISHED') {
    queryClient.setQueryData(eventosKeys.detalle(evento.eventCode), evento)
  }

  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: adminEventosKeys.evento(userId, evento.eventCode),
    }),
    queryClient.invalidateQueries({ queryKey: eventosKeys.detalle(evento.eventCode) }),
    queryClient.invalidateQueries({ queryKey: ['eventos'] }),
  ])
}

export function useBuscarEventoAdmin(eventCode: string, enabled: boolean) {
  const { sesion } = useAuth()
  const usuario = sesion.estado === 'autenticado' ? sesion.usuario : null
  const token = sesion.estado === 'autenticado' ? sesion.token : null

  return useQuery({
    queryKey: adminEventosKeys.buscar(usuario?.userId ?? 0, eventCode),
    queryFn: () => obtenerEventoAdmin(eventCode, token ?? ''),
    enabled: enabled && Boolean(eventCode) && Boolean(token),
    staleTime: 0,
  })
}

export function useEventosCreadosDeSesion() {
  const { sesion } = useAuth()
  const queryClient = useQueryClient()
  const userId = sesion.estado === 'autenticado' ? sesion.usuario.userId : 0
  const queryKey = adminEventosKeys.creados(userId)
  conservarRelacionDeSesion(queryClient, userId)

  return useQuery({
    queryKey,
    queryFn: () => queryClient.getQueryData<Evento[]>(queryKey) ?? [],
    enabled: false,
    initialData: [] as Evento[],
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

export function useAdminEvento(eventCode: string) {
  const { sesion } = useAuth()
  const usuario = sesion.estado === 'autenticado' ? sesion.usuario : null
  const token = sesion.estado === 'autenticado' ? sesion.token : null

  return useQuery({
    queryKey: adminEventosKeys.evento(usuario?.userId ?? 0, eventCode),
    queryFn: () => obtenerEventoAdmin(eventCode, token ?? ''),
    enabled: Boolean(eventCode) && Boolean(token),
    staleTime: 30_000,
  })
}

export function useSedesActivasAdmin() {
  return useSedesActivas()
}

export function useArtistasActivosAdmin() {
  return useArtistasActivos()
}

export function useCrearEventoAdmin() {
  const { sesion } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (datos: CrearEventoRequest) => {
      if (sesion.estado !== 'autenticado') {
        throw new Error('La autenticación es necesaria o ya no es válida.')
      }
      return crearEventoApi(datos, sesion.token)
    },
    onSuccess: (evento) => {
      if (sesion.estado !== 'autenticado') return
      agregarEventoCreado(queryClient, evento, sesion.usuario.userId)
      queryClient.setQueryData(
        adminEventosKeys.evento(sesion.usuario.userId, evento.eventCode),
        evento,
      )
      navigate(`/admin/eventos/${encodeURIComponent(evento.eventCode)}`)
    },
  })
}

export function usePublicarEventoAdmin(eventCode: string) {
  const { sesion } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (sesion.estado !== 'autenticado') {
        throw new Error('La autenticación es necesaria o ya no es válida.')
      }
      return publicarEventoApi(eventCode, sesion.token)
    },
    onSuccess: (evento) => {
      if (sesion.estado === 'autenticado') {
        return actualizarCachesEvento(queryClient, evento, sesion.usuario.userId)
      }
    },
  })
}

export function useAsociarArtistaAdmin(eventCode: string) {
  const { sesion } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (artistId: number) => {
      if (sesion.estado !== 'autenticado') {
        throw new Error('La autenticación es necesaria o ya no es válida.')
      }
      return asociarArtistaApi(eventCode, artistId, sesion.token)
    },
    onSuccess: (evento) => {
      if (sesion.estado === 'autenticado') {
        return actualizarCachesEvento(queryClient, evento, sesion.usuario.userId)
      }
    },
  })
}
