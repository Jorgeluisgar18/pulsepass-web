import { describe, expect, it } from 'vitest'
import { sedeSchema } from '../../../funcionalidades/sedes/tipos'

describe('tipos de sedes', () => {
    it('valida un VenueResponse realista', () => {
        const resultado =
            sedeSchema.safeParse({
                id: 1,
                code: 'VEN-001',
                name: 'Arena Pulse',
                city: 'Barranquilla',
                address: 'Calle 1 # 2-3',
                capacity: 10000,
                active: true,
            })

        expect(resultado.success).toBe(true)
    })
})