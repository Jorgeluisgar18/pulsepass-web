import { createContext } from 'react'
import type { AuthContextValor } from './tipos'

export const AuthContext = createContext<AuthContextValor | null>(null)
