import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { queryClient } from './lib/queryClient'
import router from './router'

const preferenciaTemaOscuro = window.matchMedia('(prefers-color-scheme: dark)')
const aplicarTema = (oscuro: boolean) => {
    document.documentElement.classList.toggle('dark', oscuro)
}
aplicarTema(preferenciaTemaOscuro.matches)
preferenciaTemaOscuro.addEventListener('change', (event) => {
    aplicarTema(event.matches)
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>,
)