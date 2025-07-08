import handler from '../../src/pages/api/searchplace'
import { createMocks } from 'node-mocks-http'
import * as mapboxLib from '../../src/lib/mapbox'
import * as cacheControlLib from '../../src/lib/cache-control'
import { MapBoxPlace } from '../../src/lib/types'

// Mock dependencies
jest.mock('../../src/lib/mapbox')
jest.mock('../../src/lib/cache-control')

const mockSearchPlace = mapboxLib.searchPlace as jest.MockedFunction<typeof mapboxLib.searchPlace>
const mockSetCacheControl = cacheControlLib.setCacheControl as jest.MockedFunction<typeof cacheControlLib.setCacheControl>

describe('/api/searchplace', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSetCacheControl.mockImplementation(() => {})
    })

    it('should return search results for valid place query', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { place: 'San Francisco' },
        })

        const mockResults: MapBoxPlace[] = [
            {
                place_name: 'San Francisco, CA, USA',
                center: [-122.4194, 37.7749],
                geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
                properties: {},
                type: 'Feature',
                id: 'place.123',
                bbox: [-122.5, 37.7, -122.3, 37.8],
                context: [],
                place_type: ['place'],
                relevance: 1,
                text: 'San Francisco',
            },
        ]

        mockSearchPlace.mockResolvedValue(mockResults)

        await handler(req, res)

        expect(res._getStatusCode()).toBe(200)
        const responseData = JSON.parse(res._getData())
        expect(responseData).toEqual([
            {
                place_name: 'San Francisco, CA, USA',
                center: [-122.4194, 37.7749],
            },
        ])
        expect(mockSearchPlace).toHaveBeenCalledWith('San Francisco')
    })

    it('should return empty array when no results found', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { place: 'NonexistentPlace' },
        })

        mockSearchPlace.mockResolvedValue([])

        await handler(req, res)

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual([])
    })

    it('should handle missing place parameter', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: {},
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(400)
        expect(res._getData()).toBe('Error')
    })

    it('should handle search place error', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { place: 'TestPlace' },
        })

        mockSearchPlace.mockRejectedValue(new Error('Search failed'))

        await handler(req, res)

        expect(res._getStatusCode()).toBe(500)
        expect(res._getData()).toBe('Error')
    })

    it('should handle null search results', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { place: 'TestPlace' },
        })

        mockSearchPlace.mockResolvedValue(null as unknown as MapBoxPlace[])

        await handler(req, res)

        expect(res._getStatusCode()).toBe(500)
        expect(res._getData()).toBe('Error')
    })

    it('should handle non-GET requests', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            query: { place: 'TestPlace' },
        })

        await handler(req, res)

        expect(res._getStatusCode()).toBe(404)
        expect(JSON.parse(res._getData())).toEqual([])
    })

    it('should set cache control header', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { place: 'TestPlace' },
        })

        mockSearchPlace.mockResolvedValue([])

        await handler(req, res)

        expect(mockSetCacheControl).toHaveBeenCalledWith({ res, maxAge: 86400 })
    })
})
