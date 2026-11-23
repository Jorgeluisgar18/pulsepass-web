import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  obtenerUsuarioPorEmailApi,
  obtenerUsuarioPorUsernameApi,
} from './api'
import { AuthContext } from './contexto'
import type {
  AuthContextValor,
  UsuarioAutenticado,
  UsuarioRespuesta,
} from './tipos'

type CampoPerfilPropio = 'email' | 'username'
type ConsultaPerfilPropio = (
  identificador: string,
  token: string,
) => Promise<UsuarioRespuesta>

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return contexto
}

function usePerfilPropio(
  campo: CampoPerfilPropio,
  consulta: ConsultaPerfilPropio,
  obtenerIdentificador: (usuario: UsuarioAutenticado) => string,
  habilitado: boolean,
) {
  const { sesion } = useAuth()
  const usuario = sesion.estado === 'autenticado' ? sesion.usuario : null
  const identificador = usuario ? obtenerIdentificador(usuario) : ''
  const token = sesion.estado === 'autenticado' ? sesion.token : ''

  return useQuery({
    queryKey:
      campo === 'email'
        ? ['usuarios', 'perfil-propio', identificador]
        : ['usuarios', 'perfil-propio', campo, identificador],
    queryFn: () => consulta(identificador, token),
    enabled: habilitado && Boolean(identificador && token),
    staleTime: 1000 * 60 * 5,
  })
}

export function useMiPerfil(habilitado = true) {
  return usePerfilPropio(
    'email',
    obtenerUsuarioPorEmailApi,
    (usuario) => usuario.email,
    habilitado,
  )
}

export function useUsuarioPorUsername(habilitado = true) {
  return usePerfilPropio(
    'username',
    obtenerUsuarioPorUsernameApi,
    (usuario) => usuario.username,
    habilitado,
  )
}
