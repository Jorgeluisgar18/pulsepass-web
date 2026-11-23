import type { EstadoSesion } from '../auth/tipos'

export function esVisiblePanelCompra(sesion: EstadoSesion): boolean {
  if (sesion.estado === 'cargando') {
    return false
  }

  if (sesion.estado === 'anonimo') {
    return true
  }

  return !sesion.usuario.roles.some((rol) => rol === 'STAFF' || rol === 'ADMIN')
}
