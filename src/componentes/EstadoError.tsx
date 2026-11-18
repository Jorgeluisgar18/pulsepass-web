import Boton from './Boton'

interface EstadoErrorProps {
    mensaje?: string
    onReintentar?: () => void
}

export default function EstadoError({
                                        mensaje = 'No pudimos cargar la información.',
                                        onReintentar,
                                    }: EstadoErrorProps) {
    return (
        <div role="alert" className="py-12 text-center">
            <h2 className="font-titulo text-xl font-bold text-slate-900 dark:text-slate-100">
                Algo salió mal
            </h2>

            <p className="mt-2 text-slate-600 dark:text-slate-400">{mensaje}</p>

            {onReintentar && (
                <Boton className="mt-6" onClick={onReintentar}>
                    Reintentar
                </Boton>
            )}
        </div>
    )
}