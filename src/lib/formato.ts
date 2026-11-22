import type {
  CategoriaEvento,
  EstadoEvento,
} from '../funcionalidades/eventos/tipos'

const formatoPartesFecha = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const formatoHora = new Intl.DateTimeFormat('es-CO', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const etiquetasCategoria: Record<CategoriaEvento, string> = {
  MUSIC: 'Música',
  SPORTS: 'Deportes',
  TECHNOLOGY: 'Tecnología',
  EDUCATION: 'Educación',
  CULTURE: 'Cultura',
  ENTERTAINMENT: 'Entretenimiento',
}

const etiquetasEstado: Record<EstadoEvento, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  SOLD_OUT: 'Agotado',
  CANCELLED: 'Cancelado',
  FINISHED: 'Finalizado',
}

function obtenerPartesFecha(fecha: Date) {
  const partes = formatoPartesFecha.formatToParts(fecha)

  const dia = partes.find((parte) => parte.type === 'day')?.value ?? ''

  const mes =
    partes.find((parte) => parte.type === 'month')?.value.replace(/\.$/, '') ??
    ''

  const anio = partes.find((parte) => parte.type === 'year')?.value ?? ''

  return {
    dia,
    mes,
    anio,
  }
}

export function formatearFechaEvento(valor: string) {
  const fecha = new Date(valor)

  const { dia, mes, anio } = obtenerPartesFecha(fecha)

  return `${dia} ${mes} ${anio}`
}

export function formatearFechaHoraEvento(valor: string) {
  const fecha = new Date(valor)

  return `${formatearFechaEvento(valor)} · ${formatoHora.format(fecha)}`
}

export function etiquetaCategoria(categoria: CategoriaEvento) {
  return etiquetasCategoria[categoria]
}

export function etiquetaEstado(estado: EstadoEvento) {
  return etiquetasEstado[estado]
}
