import { z } from 'zod'

export const credencialesLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'El usuario o correo electrónico es obligatorio.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
})

export type CredencialesLogin = z.infer<typeof credencialesLoginSchema>

export const respuestaLoginSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().int().positive(),
})

export type RespuestaLogin = z.infer<typeof respuestaLoginSchema>

export const rolSchema = z.enum(['USER', 'STAFF', 'ADMIN'])
export type Rol = z.infer<typeof rolSchema>

export const usuarioAutenticadoSchema = z.object({
  userId: z.number().int(),
  username: z.string().min(1),
  email: z.string().email(),
  roles: z.array(rolSchema),
})

export type UsuarioAutenticado = z.infer<typeof usuarioAutenticadoSchema>

export const registroUsuarioSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres.')
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos.',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('Ingresa un correo electrónico válido.'),
  firstName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede exceder 100 caracteres.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio.')
    .max(100, 'El apellido no puede exceder 100 caracteres.'),
  phone: z
    .string()
    .trim()
    .max(30, 'El teléfono no puede exceder 30 caracteres.')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(100, 'La ciudad no puede exceder 100 caracteres.')
    .optional()
    .or(z.literal('')),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha de nacimiento no tiene un formato válido.')
    .refine((val) => {
      const partes = val.split('-').map(Number)
      const anio = partes[0] ?? 0
      const mes = partes[1] ?? 0
      const dia = partes[2] ?? 0
      const candidato = new Date(anio, mes - 1, dia)
      return (
        candidato.getFullYear() !== anio ||
        candidato.getMonth() !== mes - 1 ||
        candidato.getDate() !== dia
      ) === false
    }, 'La fecha de nacimiento no tiene un formato válido.')
    .refine((val) => {
      const fecha = new Date(`${val}T00:00:00`)
      if (Number.isNaN(fecha.getTime())) return false
      const hoy = new Date()
      hoy.setHours(23, 59, 59, 999)
      return fecha <= hoy
    }, 'La fecha de nacimiento no puede ser una fecha futura.'),
  password: z
    .string()
    .min(12, 'La contraseña debe tener al menos 12 caracteres.')
    .refine(
      (val) => new TextEncoder().encode(val).length <= 72,
      'La contraseña no debe superar los 72 bytes en formato UTF-8.',
    ),
})

export type DatosRegistro = z.infer<typeof registroUsuarioSchema>

export const usuarioRespuestaSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1),
  email: z.string().email(),
  active: z.boolean(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  birthDate: z.string(),
})

export type UsuarioRespuesta = z.infer<typeof usuarioRespuestaSchema>

export const sesionGuardadaSchema = z.object({
  token: z.string().min(1),
  expiraEn: z.number().positive(),
  usuario: usuarioAutenticadoSchema,
})

export type SesionGuardada = z.infer<typeof sesionGuardadaSchema>

export type EstadoSesion =
  | { estado: 'cargando'; usuario: null; token: null }
  | {
      estado: 'anonimo'
      usuario: null
      token: null
      motivo?: 'expirada'
    }
  | {
      estado: 'autenticado'
      usuario: UsuarioAutenticado
      token: string
      expiraEn: number
    }

export interface AuthContextValor {
  sesion: EstadoSesion
  iniciarSesion: (credenciales: CredencialesLogin) => Promise<void>
  cerrarSesion: (motivo?: 'expirada') => void
  tieneRol: (roles: Rol | Rol[]) => boolean
}
