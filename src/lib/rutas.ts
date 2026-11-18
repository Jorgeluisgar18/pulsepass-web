export const RUTAS = {
    inicio: '/',

    eventos: '/eventos',
    evento: (eventCode: string) =>
        `/eventos/${encodeURIComponent(eventCode)}`,

    artistas: '/artistas',
    artista: (id: number | string) => `/artistas/${id}`,

    sedes: '/sedes',
    sede: (code: string) => `/sedes/${encodeURIComponent(code)}`,

    login: '/login',
    registro: '/registro',
    cuenta: '/cuenta',

    misTickets: '/mis-tickets',
    ticket: (ticketCode: string) =>
        `/mis-tickets/${encodeURIComponent(ticketCode)}`,

    confirmacionCompra: (ticketCode: string) =>
        `/compra/confirmacion/${encodeURIComponent(ticketCode)}`,

    staffValidacion: '/staff/validacion',
    staffTicketsEvento: (eventCode: string) =>
        `/staff/eventos/${encodeURIComponent(eventCode)}/tickets`,

    adminEventos: '/admin/eventos',
    adminNuevoEvento: '/admin/eventos/nuevo',
    adminEvento: (eventCode: string) =>
        `/admin/eventos/${encodeURIComponent(eventCode)}`,

    sinPermisos: '/403',
} as const

export const PATRONES_RUTA = {
    eventos: 'eventos',
    evento: 'eventos/:eventCode',

    artistas: 'artistas',
    artista: 'artistas/:id',

    sedes: 'sedes',
    sede: 'sedes/:code',

    login: 'login',
    registro: 'registro',
    cuenta: 'cuenta',

    misTickets: 'mis-tickets',
    ticket: 'mis-tickets/:ticketCode',

    confirmacionCompra: 'compra/confirmacion/:ticketCode',

    staffValidacion: 'staff/validacion',
    staffTicketsEvento: 'staff/eventos/:eventCode/tickets',

    adminEventos: 'admin/eventos',
    adminNuevoEvento: 'admin/eventos/nuevo',
    adminEvento: 'admin/eventos/:eventCode',

    sinPermisos: '403',
    noEncontrada: '*',
} as const