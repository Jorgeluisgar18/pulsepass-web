import { describe, expect, it } from 'vitest'
import { artistaSchema } from '../../../funcionalidades/artistas/schemas'

describe('schema de artistas', () => {
    it('acepta country y genre nulos', () => {
        const resultado =
            artistaSchema.safeParse({
                id: 1,
                stageName: 'Pulse Artist',
                country: null,
                genre: null,
                active: true,
            })

        expect(resultado.success).toBe(true)
    })
})