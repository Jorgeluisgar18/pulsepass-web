import type { EstadoTicket, TipoTicket } from './tipos'

const etiquetasTipo: Record<TipoTicket, string> = {
  GENERAL: 'General',
  VIP: 'VIP',
  BACKSTAGE: 'Backstage',
  STUDENT: 'Estudiante',
}

const etiquetasEstado: Record<EstadoTicket, string> = {
  RESERVED: 'Reservado',
  PAID: 'Pagado',
  CANCELLED: 'Cancelado',
  USED: 'Usado',
}

export function etiquetaTipoTicket(tipo: TipoTicket) {
  return etiquetasTipo[tipo]
}

export function etiquetaEstadoTicket(estado: EstadoTicket) {
  return etiquetasEstado[estado]
}

export function tonoEstadoTicket(estado: EstadoTicket) {
  switch (estado) {
    case 'RESERVED':
      return 'advertencia'
    case 'PAID':
      return 'exito'
    case 'CANCELLED':
      return 'error'
    case 'USED':
      return 'finalizado'
  }
}

export function formatearFechaCompra(fecha: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(fecha))
}
