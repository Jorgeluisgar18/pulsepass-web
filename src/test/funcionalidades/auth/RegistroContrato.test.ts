import { describe, expect, it } from 'vitest'
import { registroUsuarioSchema } from '../../../funcionalidades/auth/tipos'

const registroValido = {
  username: 'ana',
  email: 'ana@example.test',
  firstName: 'Ana',
  lastName: 'Garcia',
  phone: '',
  city: '',
  birthDate: '2000-01-01',
  password: 'contraseña-segura-123',
}

describe('contrato de registro', () => {
  it.each(['a', 'ab', 'José', '用户', 'ana+staff', 'ana usuaria'])(
    'acepta el username no vacío %s sin restricciones adicionales',
    (username) => {
      expect(registroUsuarioSchema.parse({ ...registroValido, username }).username)
        .toBe(username)
    },
  )

  it.each([undefined, '', '   ', '\t\n'])(
    'rechaza un username ausente o en blanco: %j',
    (username) => {
      const resultado = registroUsuarioSchema.safeParse({ ...registroValido, username })

      expect(resultado.success).toBe(false)
      if (!resultado.success) {
        expect(resultado.error.issues.some((issue) => issue.path[0] === 'username'))
          .toBe(true)
      }
    },
  )

  it.each(['username', 'firstName', 'lastName', 'phone', 'city'] as const)(
    '%s admite 255 caracteres y rechaza 256',
    (campo) => {
      const valor = 'a'.repeat(255)
      const aceptado = registroUsuarioSchema.parse({ ...registroValido, [campo]: valor })
      expect(aceptado[campo]).toBe(valor)

      const rechazado = registroUsuarioSchema.safeParse({
        ...registroValido,
        [campo]: 'a'.repeat(256),
      })
      expect(rechazado.success).toBe(false)
      if (!rechazado.success) {
        expect(rechazado.error.issues.some((issue) => issue.path[0] === campo))
          .toBe(true)
      }
    },
  )

  it('conserva la validación de email', () => {
    expect(registroUsuarioSchema.safeParse({
      ...registroValido,
      email: 'correo-invalido',
    }).success).toBe(false)
  })

  it('conserva el rechazo de una fecha de nacimiento futura', () => {
    expect(registroUsuarioSchema.safeParse({
      ...registroValido,
      birthDate: '9999-12-31',
    }).success).toBe(false)
  })
})
