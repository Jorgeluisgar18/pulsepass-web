import { sesionGuardadaSchema, type SesionGuardada } from './tipos'

export const CLAVE_SESION_STORAGE = 'pulsepass_sesion'

export interface ResultadoLecturaSesion {
  sesion: SesionGuardada | null
  motivo?: 'expirada'
}

export function leerDeSessionStorage(): ResultadoLecturaSesion {
  if (typeof window === 'undefined') {
    return { sesion: null }
  }

  const bruto = window.sessionStorage.getItem(CLAVE_SESION_STORAGE)
  if (!bruto) {
    return { sesion: null }
  }

  try {
    const resultado = sesionGuardadaSchema.safeParse(JSON.parse(bruto) as unknown)

    if (!resultado.success) {
      window.sessionStorage.removeItem(CLAVE_SESION_STORAGE)
      return { sesion: null }
    }

    if (resultado.data.expiraEn <= Date.now()) {
      window.sessionStorage.removeItem(CLAVE_SESION_STORAGE)
      return { sesion: null, motivo: 'expirada' }
    }

    return { sesion: resultado.data }
  } catch {
    window.sessionStorage.removeItem(CLAVE_SESION_STORAGE)
    return { sesion: null }
  }
}

export function guardarEnSessionStorage(datos: SesionGuardada): void {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(CLAVE_SESION_STORAGE, JSON.stringify(datos))
}

export function limpiarSessionStorage(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(CLAVE_SESION_STORAGE)
}
