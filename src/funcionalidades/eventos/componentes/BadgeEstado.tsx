import Badge from '../../../componentes/Badge'
import { etiquetaEstado } from '../../../lib/formato'
import type { EstadoEvento } from '../tipos'

interface BadgeEstadoProps {
  estado: EstadoEvento
}

const tonosEstado = {
  DRAFT: 'neutral',
  PUBLISHED: 'exito',
  SOLD_OUT: 'advertencia',
  CANCELLED: 'error',
  FINISHED: 'neutral',
} as const

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  return <Badge tono={tonosEstado[estado]}>{etiquetaEstado(estado)}</Badge>
}
