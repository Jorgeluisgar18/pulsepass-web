import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch, type FieldPath } from 'react-hook-form'
import Boton from '../componentes/Boton'
import Campo from '../componentes/Campo'
import Cargando from '../componentes/Cargando'
import EstadoError from '../componentes/EstadoError'
import EstadoVacio from '../componentes/EstadoVacio'
import { Link } from 'react-router'
import { ApiError } from '../lib/http'
import { RUTAS } from '../lib/rutas'
import {
  useCrearEventoAdmin,
  useSedesActivasAdmin,
} from '../funcionalidades/administracion/hooks'
import { mensajeErrorAdmin } from '../funcionalidades/administracion/errores'
import {
  crearEventoSchema,
  type CrearEventoFormulario,
  type CrearEventoRequest,
} from '../funcionalidades/administracion/tipos'
import { categoriaEventoSchema } from '../funcionalidades/eventos/tipos'

const etiquetasCategoria: Record<(typeof categoriaEventoSchema.options)[number], string> = {
  MUSIC: 'Música',
  SPORTS: 'Deportes',
  TECHNOLOGY: 'Tecnología',
  EDUCATION: 'Educación',
  CULTURE: 'Cultura',
  ENTERTAINMENT: 'Entretenimiento',
}

const camposEvento = {
  eventCode: 'eventCode',
  name: 'name',
  description: 'description',
  category: 'category',
  eventDate: 'eventDate',
  minimumAge: 'minimumAge',
  venueCode: 'venueCode',
} as const satisfies Record<string, FieldPath<CrearEventoFormulario>>

function errorCampo(error: unknown, campo: FieldPath<CrearEventoFormulario>) {
  if (!(error instanceof ApiError)) return ''
  return error.details[campo] ?? ''
}

export default function AdminCrearEvento() {
  const sedes = useSedesActivasAdmin()
  const crearEvento = useCrearEventoAdmin()
  const [errorGeneral, setErrorGeneral] = useState('')
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CrearEventoFormulario, unknown, CrearEventoRequest>({
    resolver: zodResolver(crearEventoSchema),
    defaultValues: {
      eventCode: '',
      name: '',
      description: '',
      eventDate: '',
    },
  })

  async function enviar(datos: CrearEventoRequest) {
    setErrorGeneral('')
    clearErrors()

    try {
      await crearEvento.mutateAsync(datos)
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 400) {
        const detallesNoMapeados: string[] = []
        for (const [campo, mensaje] of Object.entries(error.details)) {
          if (Object.hasOwn(camposEvento, campo)) {
            setError(camposEvento[campo as keyof typeof camposEvento], {
              type: 'server',
              message: mensaje,
            })
          } else {
            detallesNoMapeados.push(mensaje)
          }
        }
        setErrorGeneral([error.message, ...detallesNoMapeados].filter(Boolean).join(' '))
        return
      }

      if (error instanceof ApiError && error.status === 404) {
        setErrorGeneral('La sede seleccionada ya no está disponible. Actualiza las sedes e inténtalo de nuevo.')
        return
      }

      setErrorGeneral(
        mensajeErrorAdmin(error, 'No pudimos crear el evento. Inténtalo de nuevo.'),
      )
    }
  }

  const venues = sedes.data ?? []
  const descripcion = useWatch({ control, name: 'description' }) ?? ''

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-12">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-marca-600">PulsePass</p>
        <h1 className="mt-2 font-titulo text-3xl font-bold text-slate-900 dark:text-slate-100">
          Nuevo evento
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Completa los datos del evento. El estado inicial lo asigna el servidor.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {sedes.isPending && <Cargando mensaje="Cargando sedes activas…" />}
        {sedes.isError && (
          <EstadoError
            mensaje={mensajeErrorAdmin(sedes.error, 'No pudimos cargar las sedes activas.')}
            onReintentar={() => void sedes.refetch()}
          />
        )}
        {!sedes.isPending && !sedes.isError && venues.length === 0 && (
          <EstadoVacio
            titulo="No hay sedes activas disponibles."
            mensaje="Activa una sede antes de crear un evento."
          />
        )}

        {venues.length > 0 && (
          <form
            noValidate
            onSubmit={handleSubmit(enviar)}
            className="grid gap-5 md:grid-cols-2"
          >
            <Campo
              etiqueta="Código del evento"
              autoComplete="off"
              maxLength={255}
              error={errors.eventCode?.message ?? errorCampo(crearEvento.error, 'eventCode')}
              {...register('eventCode', { onChange: () => setErrorGeneral('') })}
            />
            <Campo
              etiqueta="Nombre del evento"
              maxLength={255}
              error={errors.name?.message ?? errorCampo(crearEvento.error, 'name')}
              {...register('name', { onChange: () => setErrorGeneral('') })}
            />

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Descripción
              </label>
              <textarea
                id="description"
                rows={4}
                maxLength={500}
                aria-invalid={Boolean(errors.description || errorCampo(crearEvento.error, 'description'))}
                aria-describedby={errors.description ? 'description-error' : undefined}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                {...register('description', { onChange: () => setErrorGeneral('') })}
              />
              {(errors.description?.message || errorCampo(crearEvento.error, 'description')) && (
                <p id="description-error" role="alert" className="text-sm text-red-600">
                  {errors.description?.message ?? errorCampo(crearEvento.error, 'description')}
                </p>
              )}
              <p className="text-right text-xs text-slate-600 dark:text-slate-300">{descripcion.length}/500</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Categoría
              </label>
              <select
                id="category"
                aria-invalid={Boolean(errors.category || errorCampo(crearEvento.error, 'category'))}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                {...register('category', { onChange: () => setErrorGeneral('') })}
              >
                <option value="">Selecciona una categoría</option>
                {categoriaEventoSchema.options.map((categoria) => (
                  <option key={categoria} value={categoria}>{etiquetasCategoria[categoria]}</option>
                ))}
              </select>
              {(errors.category?.message || errorCampo(crearEvento.error, 'category')) && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.category?.message ?? errorCampo(crearEvento.error, 'category')}
                </p>
              )}
            </div>

            <Campo
              etiqueta="Fecha y hora"
              type="datetime-local"
              error={errors.eventDate?.message ?? errorCampo(crearEvento.error, 'eventDate')}
              {...register('eventDate', { onChange: () => setErrorGeneral('') })}
            />
            <Campo
              etiqueta="Edad mínima"
              type="number"
              min={0}
              step={1}
              error={errors.minimumAge?.message ?? errorCampo(crearEvento.error, 'minimumAge')}
              {...register('minimumAge', {
                valueAsNumber: true,
                onChange: () => setErrorGeneral(''),
              })}
            />

            <div className="space-y-2">
              <label htmlFor="venueCode" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Sede
              </label>
              <select
                id="venueCode"
                aria-invalid={Boolean(errors.venueCode || errorCampo(crearEvento.error, 'venueCode'))}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                {...register('venueCode', { onChange: () => setErrorGeneral('') })}
              >
                <option value="">Selecciona una sede</option>
                {venues.map((venue) => (
                  <option key={venue.code} value={venue.code}>
                    {venue.name} — {venue.city}
                  </option>
                ))}
              </select>
              {(errors.venueCode?.message || errorCampo(crearEvento.error, 'venueCode')) && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.venueCode?.message ?? errorCampo(crearEvento.error, 'venueCode')}
                </p>
              )}
            </div>

            {errorGeneral && (
              <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200 md:col-span-2">
                {errorGeneral}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
              <Boton type="submit" cargando={isSubmitting || crearEvento.isPending}>
                Crear evento
              </Boton>
              <Link
                to={RUTAS.adminEventos}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Volver a eventos
              </Link>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
