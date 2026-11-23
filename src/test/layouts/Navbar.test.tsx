import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http as mockHttp } from 'msw'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../funcionalidades/auth/AuthContext'
import Navbar from '../../layouts/Navbar'
import type { Rol } from '../../funcionalidades/auth/tipos'
import { server } from '../mocks/server'

function renderNavbar() {
    const router = createMemoryRouter(
        [
            {
                path: '*',
                element: (
                    <AuthProvider>
                        <Navbar />
                    </AuthProvider>
                ),
            },
        ],
        {
            initialEntries: ['/'],
        },
    )

    render(<RouterProvider router={router} />)
}

describe('Navbar', () => {
    beforeEach(() => {
        vi.spyOn(Date, 'now').mockReturnValue(Date.UTC(2026, 10, 23, 12))
    })

    afterEach(() => {
        window.localStorage.removeItem('pulsepass_tema')
        document.documentElement.classList.remove('dark')
        vi.restoreAllMocks()
    })

    it('FR-FE-GEN-004 alterna el tema manual y anuncia su estado', async () => {
        const user = userEvent.setup()
        const matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            writable: true,
            value: matchMedia,
        })

        renderNavbar()

        const activarOscuro = screen.getByRole('button', { name: 'Activar modo oscuro' })
        expect(activarOscuro).toHaveAttribute('aria-pressed', 'false')
        expect(document.documentElement).not.toHaveClass('dark')

        await user.click(activarOscuro)

        expect(document.documentElement).toHaveClass('dark')
        expect(window.localStorage.getItem('pulsepass_tema')).toBe('oscuro')
        expect(screen.getByRole('button', { name: 'Activar modo claro' })).toHaveAttribute(
            'aria-pressed',
            'true',
        )
    })

    it('FR-FE-GEN-004 respeta el sistema oscuro en una sesión limpia', () => {
        const matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: true,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            writable: true,
            value: matchMedia,
        })

        renderNavbar()

        expect(document.documentElement).toHaveClass('dark')
        expect(screen.getByRole('button', { name: 'Activar modo claro' })).toHaveAttribute(
            'aria-pressed',
            'true',
        )
    })

    it('FR-FE-GEN-004 sigue el sistema sin preferencia manual y la elección manual prevalece', async () => {
        const user = userEvent.setup()
        let cambioSistema: ((evento: MediaQueryListEvent) => void) | null = null
        const matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: vi.fn((_tipo: string, listener: (evento: MediaQueryListEvent) => void) => {
                cambioSistema = listener
            }),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            writable: true,
            value: matchMedia,
        })

        renderNavbar()

        expect(document.documentElement).not.toHaveClass('dark')
        act(() => {
            cambioSistema?.({ matches: true } as MediaQueryListEvent)
        })
        expect(document.documentElement).toHaveClass('dark')

        await user.click(screen.getByRole('button', { name: 'Activar modo claro' }))
        act(() => {
            cambioSistema?.({ matches: true } as MediaQueryListEvent)
        })
        expect(document.documentElement).not.toHaveClass('dark')
        expect(window.localStorage.getItem('pulsepass_tema')).toBe('claro')
    })

    it('TEST-FE-GEN-003 muestra la navegación pública de un visitante', () => {
        renderNavbar()

        for (const name of ['Mis tickets', 'Validación', 'Administración', 'Mi cuenta']) {
            expect(screen.queryByRole('link', { name: name === 'Mi cuenta' ? /Mi cuenta/ : name })).not.toBeInTheDocument()
        }
        expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Eventos' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Artistas' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Sedes' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Ingresar' }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', { name: 'Registrarse' }),
        ).toBeInTheDocument()
    })

    it.each<{ caso: string; roles: Rol[]; visibles: string[]; ocultos: string[] }>([
        { caso: 'USER', roles: ['USER'], visibles: ['Mis tickets'], ocultos: ['Validación', 'Administración'] },
        { caso: 'STAFF', roles: ['STAFF'], visibles: ['Validación'], ocultos: ['Mis tickets', 'Administración'] },
        { caso: 'ADMIN', roles: ['ADMIN'], visibles: ['Validación', 'Administración'], ocultos: ['Mis tickets'] },
        { caso: 'USER + STAFF', roles: ['USER', 'STAFF'], visibles: ['Mis tickets', 'Validación'], ocultos: ['Administración'] },
        { caso: 'USER + ADMIN', roles: ['USER', 'ADMIN'], visibles: ['Mis tickets', 'Validación', 'Administración'], ocultos: [] },
    ])('TEST-FE-GEN-003 muestra enlaces permitidos para $caso en escritorio y menú móvil', async ({ roles, visibles, ocultos }) => {
        // Roles must come from /auth/me, not from the stored session snapshot.
        window.sessionStorage.setItem('pulsepass_sesion', JSON.stringify({
            token: 'navbar-test-token',
            expiraEn: Date.now() + 60_000,
            usuario: { userId: 42, username: 'ana', email: 'ana@example.com', roles: [] },
        }))
        server.use(mockHttp.get('/api/auth/me', ({ request }) => {
            expect(request.headers.get('Authorization')).toBe('Bearer navbar-test-token')
            return HttpResponse.json({ userId: 42, username: 'ana', email: 'ana@example.com', roles })
        }))
        const user = userEvent.setup()
        renderNavbar()
        await screen.findByRole('link', { name: /Mi cuenta/ })

        for (const name of ['Eventos', 'Artistas', 'Sedes', 'Mi cuenta', ...visibles]) {
            expect(screen.getByRole('link', { name: name === 'Mi cuenta' ? /Mi cuenta/ : name })).toBeInTheDocument()
        }
        for (const name of ['Ingresar', 'Registrarse', ...ocultos]) {
            expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
        }
        expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Abrir menú' }))
        for (const name of ['Eventos', 'Artistas', 'Sedes', 'Mi cuenta', ...visibles]) {
            expect(screen.getAllByRole('link', { name: name === 'Mi cuenta' ? /Mi cuenta/ : name })).toHaveLength(2)
        }
        for (const name of ['Ingresar', 'Registrarse', ...ocultos]) {
            expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
        }
        expect(screen.getAllByRole('button', { name: 'Cerrar sesión' })).toHaveLength(2)
    })

    it('TEST-FE-GEN-004 abre y cierra el menú móvil mediante teclado', async () => {
        const user = userEvent.setup()

        renderNavbar()

        const abrirMenu = screen.getByRole('button', {
            name: 'Abrir menú',
        })

        abrirMenu.focus()

        await user.keyboard('{Enter}')

        expect(
            screen.getByRole('button', { name: 'Cerrar menú' }),
        ).toHaveAttribute('aria-expanded', 'true')

        await user.keyboard('{Enter}')

        expect(
            screen.getByRole('button', { name: 'Abrir menú' }),
        ).toHaveAttribute('aria-expanded', 'false')
    })
})