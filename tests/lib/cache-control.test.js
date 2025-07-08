import { setCacheControl } from '../../src/lib/cache-control'
import { createMocks } from 'node-mocks-http'

describe('cache-control', () => {
    let res

    beforeEach(() => {
        const { res: mockRes } = createMocks()
        res = mockRes
    })

    describe('setCacheControl', () => {
        it('should set public cache control with maxAge when maxAge > 0', () => {
            setCacheControl({ res, maxAge: 3600 })

            expect(res._getHeaders()['cache-control']).toBe('public, max-age=3600')
        })

        it('should set default maxAge of 120 when not provided', () => {
            setCacheControl({ res })

            expect(res._getHeaders()['cache-control']).toBe('public, max-age=120')
        })

        it('should set no-cache headers when maxAge is 0', () => {
            setCacheControl({ res, maxAge: 0 })

            expect(res._getHeaders()['cache-control']).toBe('private, no-cache, no-store, max-age=0, must-revalidate')
        })

        it('should set no-cache headers when maxAge is negative', () => {
            setCacheControl({ res, maxAge: -1 })

            expect(res._getHeaders()['cache-control']).toBe('private, no-cache, no-store, max-age=0, must-revalidate')
        })

        it('should handle large maxAge values', () => {
            setCacheControl({ res, maxAge: 86400 }) // 24 hours

            expect(res._getHeaders()['cache-control']).toBe('public, max-age=86400')
        })

        it('should handle very large maxAge values', () => {
            setCacheControl({ res, maxAge: 31536000 }) // 1 year

            expect(res._getHeaders()['cache-control']).toBe('public, max-age=31536000')
        })
    })
})
