import clsx from 'clsx'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { RUTAS } from '../lib/rutas'

const clasesEnlace =
    'rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600'

function clasesNavLink(activo: boolean) {
    return clsx(
        clasesEnlace,
        activo
            ? 'bg-marca-50 text-marca-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    )
}

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false)

    function cerrarMenu() {
        setMenuAbierto(false)
    }

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
            <nav
                aria-label="Principal"
                className="mx-auto max-w-6xl px-4"
            >
                <div className="flex min-h-16 items-center justify-between">
                    <NavLink
                        to={RUTAS.inicio}
                        end
                        onClick={cerrarMenu}
                        className="flex items-center gap-2 rounded-md font-titulo text-xl font-bold text-marca-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marca-600"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 18V5l10-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="16" cy="16" r="3" />
                        </svg>

                        PulsePass
                    </NavLink>

                    <div className="hidden items-center gap-1 md:flex">
                        <NavLink
                            to={RUTAS.eventos}
                            className={({ isActive }) => clasesNavLink(isActive)}
                        >
                            Eventos
                        </NavLink>

                        <NavLink
                            to={RUTAS.artistas}
                            className={({ isActive }) => clasesNavLink(isActive)}
                        >
                            Artistas
                        </NavLink>

                        <NavLink
                            to={RUTAS.sedes}
                            className={({ isActive }) => clasesNavLink(isActive)}
                        >
                            Sedes
                        </NavLink>

                        <div
                            aria-hidden="true"
                            className="mx-2 h-6 w-px bg-slate-200"
                        />

                        <NavLink
                            to={RUTAS.login}
                            className={({ isActive }) => clasesNavLink(isActive)}
                        >
                            Ingresar
                        </NavLink>

                        <NavLink
                            to={RUTAS.registro}
                            className="ml-1 inline-flex min-h-11 items-center justify-center rounded-lg bg-marca-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                        >
                            Registrarse
                        </NavLink>
                    </div>

                    <button
                        type="button"
                        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={menuAbierto}
                        aria-controls="menu-movil"
                        onClick={() => setMenuAbierto((abierto) => !abierto)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 md:hidden"
                    >
                        {menuAbierto ? (
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <path d="M6 6l12 12M18 6 6 18" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {menuAbierto && (
                    <div
                        id="menu-movil"
                        className="border-t border-slate-200 py-3 md:hidden"
                    >
                        <div className="flex flex-col gap-1">
                            <NavLink
                                to={RUTAS.eventos}
                                onClick={cerrarMenu}
                                className={({ isActive }) => clasesNavLink(isActive)}
                            >
                                Eventos
                            </NavLink>

                            <NavLink
                                to={RUTAS.artistas}
                                onClick={cerrarMenu}
                                className={({ isActive }) => clasesNavLink(isActive)}
                            >
                                Artistas
                            </NavLink>

                            <NavLink
                                to={RUTAS.sedes}
                                onClick={cerrarMenu}
                                className={({ isActive }) => clasesNavLink(isActive)}
                            >
                                Sedes
                            </NavLink>

                            <div
                                aria-hidden="true"
                                className="my-2 h-px bg-slate-200"
                            />

                            <NavLink
                                to={RUTAS.login}
                                onClick={cerrarMenu}
                                className={({ isActive }) => clasesNavLink(isActive)}
                            >
                                Ingresar
                            </NavLink>

                            <NavLink
                                to={RUTAS.registro}
                                onClick={cerrarMenu}
                                className={({ isActive }) => clasesNavLink(isActive)}
                            >
                                Registrarse
                            </NavLink>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}