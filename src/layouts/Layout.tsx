import { Outlet } from 'react-router'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <a
                href="#contenido"
                className="sr-only z-50 rounded-md bg-white px-4 py-2 text-marca-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Saltar al contenido
            </a>

            <Navbar />

            <main id="contenido" className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}