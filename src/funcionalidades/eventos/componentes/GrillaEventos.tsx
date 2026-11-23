import type { EventoResumen } from '../tipos'
import TarjetaEvento from './TarjetaEvento'

interface GrillaEventosProps {
    eventos: EventoResumen[]
}

export default function GrillaEventos({
                                          eventos,
                                      }: GrillaEventosProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
                <TarjetaEvento
                    key={evento.eventCode}
                    evento={evento}
                />
            ))}
        </div>
    )
}