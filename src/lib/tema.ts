export type Tema = 'claro' | 'oscuro'

const CLAVE_TEMA = 'pulsepass_tema'
const EVENTO_TEMA = 'pulsepass_tema_cambiado'

function coincideConOscuroDelSistema() {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function leerTemaGuardado(): Tema | null {
  const valor = window.localStorage.getItem(CLAVE_TEMA)
  return valor === 'claro' || valor === 'oscuro' ? valor : null
}

export function obtenerTemaInicial(): Tema {
  return leerTemaGuardado() ?? (coincideConOscuroDelSistema() ? 'oscuro' : 'claro')
}

export function aplicarTema(tema: Tema) {
  const oscuro = tema === 'oscuro'
  document.documentElement.classList.toggle('dark', oscuro)
  document.documentElement.style.colorScheme = tema

  const metaTema = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  metaTema?.setAttribute('content', oscuro ? '#020617' : '#f8fafc')
}

export function establecerTema(tema: Tema) {
  window.localStorage.setItem(CLAVE_TEMA, tema)
  aplicarTema(tema)
  window.dispatchEvent(new CustomEvent(EVENTO_TEMA, { detail: tema }))
}

export function alternarTema(tema: Tema): Tema {
  const siguiente = tema === 'oscuro' ? 'claro' : 'oscuro'
  establecerTema(siguiente)
  return siguiente
}

export function inicializarTema() {
  const temaInicial = obtenerTemaInicial()
  aplicarTema(temaInicial)

  if (typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)')
  const manejarCambio = (evento: MediaQueryListEvent) => {
    if (leerTemaGuardado()) return

    const siguiente: Tema = evento.matches ? 'oscuro' : 'claro'
    aplicarTema(siguiente)
    window.dispatchEvent(new CustomEvent(EVENTO_TEMA, { detail: siguiente }))
  }

  preferenciaSistema.addEventListener('change', manejarCambio)
  return () => preferenciaSistema.removeEventListener('change', manejarCambio)
}

export function escucharCambioTema(callback: (tema: Tema) => void) {
  const manejarCambio = (evento: Event) => {
    const tema = (evento as CustomEvent<Tema>).detail
    callback(tema)
  }

  window.addEventListener(EVENTO_TEMA, manejarCambio)
  return () => window.removeEventListener(EVENTO_TEMA, manejarCambio)
}
