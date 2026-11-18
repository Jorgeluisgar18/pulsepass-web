import {
    isRouteErrorResponse,
    Link,
    useRouteError,
} from 'react-router'
import { RUTAS } from '../lib/rutas'

export default function ErrorPagina() {
    const error = useRouteError()

    let mensaje =
        'Ocurrió un error inesperado. Inténtalo más tarde.'

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            mensaje = 'No encontramos el recurso solicitado.'
        } else if (error.status === 403) {
            mensaje = 'No tienes permisos para acceder a esta sección.'
        }
    }

    return (
        <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-20">
            <div className="max-w-lg text-center">
                <h1 className="font-titulo text-3xl font-bold">
                    ¡Ups! Algo salió mal.
                </h1>

                <p className="mt-4 text-slate-600 dark:text-slate-400">
                    {mensaje}
                </p>

                <div className="mt-8">
                    <Link
                        to={RUTAS.inicio}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-marca-600 px-5 py-3 font-semibold text-white hover:bg-marca-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-600"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </section>
    )
}