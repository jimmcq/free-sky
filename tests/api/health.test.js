import handler from '../../src/pages/api/health'
import { createMocks } from 'node-mocks-http'

describe('/api/health', () => {
    it('should return health status for GET request', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(200)
        const responseData = JSON.parse(res._getData())

        expect(responseData).toHaveProperty('status', 'ok')
        expect(responseData).toHaveProperty('timestamp')
        expect(responseData).toHaveProperty('uptime')
        expect(responseData).toHaveProperty('environment')
        expect(responseData).toHaveProperty('version')

        expect(typeof responseData.timestamp).toBe('string')
        expect(typeof responseData.uptime).toBe('number')
        expect(responseData.uptime).toBeGreaterThan(0)
    })

    it('should handle non-GET requests', async () => {
        const { req, res } = createMocks({
            method: 'POST',
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(405)
        expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' })
    })

    it('should return valid timestamp format', async () => {
        const { req, res } = createMocks({
            method: 'GET',
        })

        await handler(req, res)

        const responseData = JSON.parse(res._getData())
        const timestamp = new Date(responseData.timestamp)

        expect(timestamp.toISOString()).toBe(responseData.timestamp)
        expect(timestamp.getTime()).toBeGreaterThan(0)
    })
})
