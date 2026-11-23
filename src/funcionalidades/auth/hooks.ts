import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { obtenerUsuarioPorEmailApi } from './api'
import { AuthContext } from './contexto'
import type { AuthContextValor } from './tipos'

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return contexto
}

export function useMiPerfil() {
  const { sesion } = useAuth()
  const email = sesion.estado === 'autenticado' ? sesion.usuario.email : ''
  const token = sesion.estado === 'autenticado' ? sesion.token : ''

  return useQuery({
    queryKey: ['usuarios', 'perfil-propio', email],
    queryFn: () => obtenerUsuarioPorEmailApi(email, token),
    enabled: Boolean(email && token),
    staleTime: 1000 * 60 * 5,
  })
}
