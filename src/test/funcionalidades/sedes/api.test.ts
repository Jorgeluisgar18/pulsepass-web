import {
    HttpResponse,
    http as mockHttp,
} from 'msw'
import { describe, expect, it } from 'vitest'
import {
    obtenerSedePorCodigo,
    obtenerSedesActivas,
} from '../../../funcionalidades/sedes/api'
import { sedesQueries } from '../../../funcionalidades/sedes/hooks'
import { server } from '../../mocks/server'

const sede = {
    id: 1,
    code: 'VEN-SMR-01',
    name: 'Marina Convention Center',
    city: 'Santa Marta',
    address: 'Santa Marta',
    capacity: 5000,
    active: true,
}

describe('API de sedes', () => {
    it('consulta las sedes activas', async () => {
        server.use(
            mockHttp.get(
                '/api/venues/active',
                () =>
                    HttpResponse.json([sede]),
            ),
        )

        const resultado =
            await obtenerSedesActivas()

        expect(resultado).toHaveLength(1)
    })

    it('consulta una sede por código', async () => {
        server.use(
            mockHttp.get(
                '/api/venues/VEN-SMR-01',
                () =>
                    HttpResponse.json(sede),
            ),
        )

        const resultado =
            await obtenerSedePorCodigo(
                'VEN-SMR-01',
            )

        expect(resultado.code).toBe(
            'VEN-SMR-01',
        )
    })

    it('mantiene las query keys y staleTime definidos', () => {
        expect(
            sedesQueries.activas().queryKey,
        ).toEqual([
            'sedes',
            'activas',
        ])

        expect(
            sedesQueries.activas().staleTime,
        ).toBe(5 * 60_000)

        expect(
            sedesQueries.detalle(
                'VEN-SMR-01',
            ).queryKey,
        ).toEqual([
            'sede',
            'VEN-SMR-01',
        ])
    })
})