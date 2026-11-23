import { http } from '../../lib/http'
import { validarRespuesta } from '../../lib/validacion'
import {
  respuestaLoginSchema,
  usuarioAutenticadoSchema,
  usuarioRespuestaSchema,
  type CredencialesLogin,
  type DatosRegistro,
  type RespuestaLogin,
  type UsuarioAutenticado,
  type UsuarioRespuesta,
} from './tipos'

export async function iniciarSesionApi(
  credenciales: CredencialesLogin,
): Promise<RespuestaLogin> {
  const respuesta = await http('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credenciales),
    operacion: 'login',
  })

  return validarRespuesta(respuestaLoginSchema, respuesta)
}

export async function obtenerPerfilAutenticadoApi(
  token: string,
): Promise<UsuarioAutenticado> {
  const respuesta = await http('/auth/me', {
    method: 'GET',
    token,
    operacion: 'identidad',
  })

  return validarRespuesta(usuarioAutenticadoSchema, respuesta)
}

export async function registrarUsuarioApi(
  datos: DatosRegistro,
): Promise<UsuarioRespuesta> {
  const cuerpo = {
    ...datos,
    phone: datos.phone?.trim() ? datos.phone.trim() : null,
    city: datos.city?.trim() ? datos.city.trim() : null,
  }

  const respuesta = await http('/users', {
    method: 'POST',
    body: JSON.stringify(cuerpo),
  })

  return validarRespuesta(usuarioRespuestaSchema, respuesta)
}

export async function obtenerUsuarioPorEmailApi(
  email: string,
  token: string,
): Promise<UsuarioRespuesta> {
  const respuesta = await http(
    `/users/by-email?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(usuarioRespuestaSchema, respuesta)
}

export async function obtenerUsuarioPorUsernameApi(
  username: string,
  token: string,
): Promise<UsuarioRespuesta> {
  const respuesta = await http(
    `/users/by-username?username=${encodeURIComponent(username)}`,
    {
      method: 'GET',
      token,
      operacion: 'autenticada',
    },
  )

  return validarRespuesta(usuarioRespuestaSchema, respuesta)
}
