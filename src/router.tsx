import { createBrowserRouter } from 'react-router'
import type { RouteObject } from 'react-router'
import CargandoRuta from "./layouts/CargandoRuta";
import Layout from './layouts/Layout'
import { PATRONES_RUTA } from './lib/rutas'
import ErrorPagina from './pages/ErrorPagina'
import Inicio from './pages/Inicio'

export const rutasAplicacion: RouteObject[] = [
    {
        path: '/',
        Component: Layout,
        HydrateFallback: CargandoRuta,
        errorElement: <ErrorPagina />,
        children: [
            {
                index: true,
                Component: Inicio,
            },

            {
                path: PATRONES_RUTA.eventos,
                lazy: async () => ({
                    Component: (await import('./pages/CatalogoEventos')).default,
                }),
            },
            {
                path: PATRONES_RUTA.evento,
                lazy: async () => ({
                    Component: (await import('./pages/DetalleEvento')).default,
                }),
            },

            {
                path: PATRONES_RUTA.artistas,
                lazy: async () => ({
                    Component: (await import('./pages/ListaArtistas')).default,
                }),
            },
            {
                path: PATRONES_RUTA.artista,
                lazy: async () => ({
                    Component: (await import('./pages/DetalleArtista')).default,
                }),
            },

            {
                path: PATRONES_RUTA.sedes,
                lazy: async () => ({
                    Component: (await import('./pages/ListaSedes')).default,
                }),
            },
            {
                path: PATRONES_RUTA.sede,
                lazy: async () => ({
                    Component: (await import('./pages/DetalleSede')).default,
                }),
            },

            {
                path: PATRONES_RUTA.login,
                lazy: async () => ({
                    Component: (await import('./pages/Login')).default,
                }),
            },
            {
                path: PATRONES_RUTA.registro,
                lazy: async () => ({
                    Component: (await import('./pages/Registro')).default,
                }),
            },

            {
                path: PATRONES_RUTA.cuenta,
                lazy: async () => ({
                    Component: (await import('./pages/Cuenta')).default,
                }),
            },

            {
                path: PATRONES_RUTA.misTickets,
                lazy: async () => ({
                    Component: (await import('./pages/MisTickets')).default,
                }),
            },
            {
                path: PATRONES_RUTA.ticket,
                lazy: async () => ({
                    Component: (await import('./pages/DetalleTicket')).default,
                }),
            },
            {
                path: PATRONES_RUTA.confirmacionCompra,
                lazy: async () => ({
                    Component: (await import('./pages/ConfirmacionCompra')).default,
                }),
            },

            {
                path: PATRONES_RUTA.staffValidacion,
                lazy: async () => ({
                    Component: (await import('./pages/ValidacionIngreso')).default,
                }),
            },
            {
                path: PATRONES_RUTA.staffTicketsEvento,
                lazy: async () => ({
                    Component: (await import('./pages/TicketsPagadosEvento')).default,
                }),
            },

            {
                path: PATRONES_RUTA.adminEventos,
                lazy: async () => ({
                    Component: (await import('./pages/AdminEventos')).default,
                }),
            },
            {
                path: PATRONES_RUTA.adminNuevoEvento,
                lazy: async () => ({
                    Component: (await import('./pages/AdminCrearEvento')).default,
                }),
            },
            {
                path: PATRONES_RUTA.adminEvento,
                lazy: async () => ({
                    Component: (await import('./pages/AdminGestionEvento')).default,
                }),
            },

            {
                path: PATRONES_RUTA.sinPermisos,
                lazy: async () => ({
                    Component: (await import('./pages/SinPermisos')).default,
                }),
            },

            {
                path: PATRONES_RUTA.noEncontrada,
                lazy: async () => ({
                    Component: (await import('./pages/NoEncontrada')).default,
                }),
            },
        ],
    },
]

const router = createBrowserRouter(rutasAplicacion)

export default router