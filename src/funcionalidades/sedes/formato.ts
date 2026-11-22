const formatoNumero = new Intl.NumberFormat('es-CO')

export function formatearCapacidad(capacidad: number) {
  return formatoNumero.format(capacidad)
}
