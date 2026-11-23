import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import Cargando from '../../../componentes/Cargando'
import { RUTAS } from '../../../lib/rutas'
import { useAuth } from '../hooks'
import type { Rol } from '../tipos'

interface RutaPorRolProps {
  rolesPermitidos: Rol[]
  children?: ReactNode
}

export default function RutaPorRol({
  rolesPermitidos,
  children,
}: RutaPorRolProps) {
  const { sesion, tieneRol } = useAuth()
  const location = useLocation()

  if (sesion.estado === 'cargando') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <Cargando mensaje="Comprobando sesión…" />
      </div>
    )
  }

  if (sesion.estado === 'anonimo') {
    const desde =
      location.pathname +
      location.search +
      location.hash

    return (
      <Navigate
        to={RUTAS.login}
        state={{
          desde,
          ...(sesion.motivo ? { motivo: sesion.motivo } : {}),
        }}
        replace
      />
    )
  }

  const autorizado = rolesPermitidos.some((rol) => tieneRol(rol))

  if (!autorizado) {
    return <Navigate to={RUTAS.sinPermisos} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
