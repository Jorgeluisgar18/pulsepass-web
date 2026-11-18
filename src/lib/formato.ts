import type {
    CategoriaEvento,
    EstadoEvento,
} from '../funcionalidades/eventos/tipos'

const formatoFecha =
    new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

const etiquetasCategoria: Record<
    CategoriaEvento,
    string
> = {
    MUSIC: 'Música',
    SPORTS: 'Deportes',
    TECHNOLOGY: 'Tecnología',
    EDUCATION: 'Educación',
    CULTURE: 'Cultura',
    ENTERTAINMENT: 'Entretenimiento',
}

const etiquetasEstado: Record<
    EstadoEvento,
    string
> = {
    DRAFT: 'Borrador',
    PUBLISHED: 'Publicado',
    SOLD_OUT: 'Agotado',
    CANCELLED: 'Cancelado',
    FINISHED: 'Finalizado',
}

export function formatearFechaEvento(
    valor: string,
) {
    return formatoFecha.format(
        new Date(valor),
    )
}

export function etiquetaCategoria(
    categoria: CategoriaEvento,
) {
    return etiquetasCategoria[categoria]
}

export function etiquetaEstado(
    estado: EstadoEvento,
) {
    return etiquetasEstado[estado]
}