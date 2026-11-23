import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import Cargando from '../../../componentes/Cargando'
import { RUTAS, esRutaInternaSegura } from '../../../lib/rutas'
import { useAuth } from '../hooks'

interface SoloAnonimoProps {
  children?: ReactNode
}

interface EstadoUbicacion {
  desde?: string
}

export default function SoloAnonimo({ children }: SoloAnonimoProps) {
  const { sesion } = useAuth()
  const location = useLocation()
  const state = location.state as EstadoUbicacion | null

  if (sesion.estado === 'cargando') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <Cargando mensaje="Comprobando sesión…" />
      </div>
    )
  }

  if (sesion.estado === 'autenticado') {
    const destino = esRutaInternaSegura(state?.desde) &&
      state.desde !== RUTAS.login &&
      state.desde !== RUTAS.registro
      ? state.desde
      : RUTAS.inicio

    return <Navigate to={destino} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
