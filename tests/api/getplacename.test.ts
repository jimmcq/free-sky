import handler from '../../src/pages/api/getplacename'
import { createMocks } from 'node-mocks-http'
import * as mapboxLib from '../../src/lib/mapbox'
import * as cacheControlLib from '../../src/lib/cache-control'
import * as helpersLib from '../../src/lib/helpers'

// Mock dependencies
jest.mock('../../src/lib/mapbox')
jest.mock('../../src/lib/cache-control')
jest.mock('../../src/lib/helpers')

const mockGetPlaceName = mapboxLib.getPlaceName as jest.MockedFunction<typeof mapboxLib.getPlaceName>
const mockSetCacheControl = cacheControlLib.setCacheControl as jest.MockedFunction<typeof cacheControlLib.setCacheControl>
const mockNormalizeCoordinates = helpersLib.normalizeCoordinates as jest.MockedFunction<typeof helpersLib.normalizeCoordinates>

describe('/api/getplacename', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSetCacheControl.mockImplementation(() => {})
        mockNormalizeCoordinates.mockReturnValue({ latitude: '37.7749', longitude: '-122.4194' })
    })

    it('should return place name for valid coordinates', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { latitude: '37.7749', longitude: '-122.4194' },
        })

        mockGetPlaceName.mockResolvedValue('San Francisco, CA')

        await handler(req, res)

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toBe('San Francisco, CA')
        expect(mockGetPlaceName).toHaveBeenCalledWith({ latitude: '37.7749', longitude: '-122.4194' })
    })

    it('should return empty string for place name not found', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { latitude: '37.7749', longitude: '-122.4194' },
        })

        mockGetPlaceName.mockResolvedValue(null)

        await handler(req, res)

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toBe('')
    })

    it('should handle invalid coordinates', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { latitude: 'invalid', longitude: 'invalid' },
        })

        mockNormalizeCoordinates.mockImplementation(() => {
            throw new Error('Invalid coordinates')
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(500)
        expect(res._getData()).toBe('Invalid location coordinates')
    })

    it('should handle non-GET requests', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            query: { latitude: '37.7749', longitude: '-122.4194' },
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(404)
        expect(res._getData()).toBe('')
    })

    it('should set cache control header', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { latitude: '37.7749', longitude: '-122.4194' },
        })

        mockGetPlaceName.mockResolvedValue('San Francisco, CA')

        await handler(req, res)

        expect(mockSetCacheControl).toHaveBeenCalledWith({ res, maxAge: 86400 })
    })
})
