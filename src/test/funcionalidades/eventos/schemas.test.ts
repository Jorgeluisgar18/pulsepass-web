import { describe, expect, it } from 'vitest'
import {
    eventoResumenSchema,
    eventoSchema,
} from '../../../funcionalidades/eventos/schemas'

describe('schemas de eventos', () => {
    it('valida un EventSummaryResponse realista', () => {
        const resultado =
            eventoResumenSchema.safeParse({
                id: 1,
                eventCode: 'EVT-001',
                name: 'Festival Pulse',
                category: 'MUSIC',
                status: 'PUBLISHED',
                eventDate:
                    '2026-12-20T20:00:00',
                venueCode: 'VEN-001',
                venueName: 'Arena Pulse',
            })

        expect(resultado.success).toBe(true)
    })

    it('acepta campos nullable de EventResponse', () => {
        const resultado =
            eventoSchema.safeParse({
                id: 1,
                eventCode: 'EVT-001',
                name: 'Festival Pulse',
                description: null,
                category: 'MUSIC',
                status: 'PUBLISHED',
                eventDate:
                    '2026-12-20T20:00:00',
                minimumAge: null,
                streamingUrl: null,
                venueCode: 'VEN-001',
                venueName: 'Arena Pulse',
                artists: [],
            })

        expect(resultado.success).toBe(true)
    })

    it('rechaza una categoría desconocida', () => {
        const resultado =
            eventoResumenSchema.safeParse({
                id: 1,
                eventCode: 'EVT-001',
                name: 'Festival Pulse',
                category: 'UNKNOWN',
                status: 'PUBLISHED',
                eventDate:
                    '2026-12-20T20:00:00',
                venueCode: 'VEN-001',
                venueName: 'Arena Pulse',
            })

        expect(resultado.success).toBe(false)
    })
})