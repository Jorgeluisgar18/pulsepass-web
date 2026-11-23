import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    vi,
} from 'vitest'
import { server } from './mocks/server'

beforeAll(() => {
    server.listen({
        onUnhandledFrame: 'error',
    })
})

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(Date.UTC(2026, 10, 23, 12))
})

afterEach(() => {
    cleanup()
    server.resetHandlers()
    window.sessionStorage.clear()
    vi.restoreAllMocks()
    vi.useRealTimers()
})

afterAll(() => {
    server.close()
})