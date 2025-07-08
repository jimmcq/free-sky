import { getPlaceName, searchPlace } from '../../src/lib/mapbox'
import * as cacheLib from '../../src/lib/cache'
import * as helpersLib from '../../src/lib/helpers'

// Mock dependencies
jest.mock('../../src/lib/cache')
jest.mock('../../src/lib/helpers')

const mockCacheGet = cacheLib.cacheGet
const mockCacheSet = cacheLib.cacheSet
const mockSafeKey = cacheLib.safeKey
const mockNormalizeCoordinates = helpersLib.normalizeCoordinates

// Mock fetch
global.fetch = jest.fn()

describe('MapBox API Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockCacheGet.mockResolvedValue(null) // No cache hit by default
        mockCacheSet.mockResolvedValue(undefined)
        mockSafeKey.mockReturnValue('mock-cache-key')
        mockNormalizeCoordinates.mockReturnValue({
            latitude: '37.7749',
            longitude: '-122.4194',
        })

        // Set environment variable
        process.env.MAPBOX_ACCESS_TOKEN = 'mock-access-token'
    })

    afterEach(() => {
        delete process.env.MAPBOX_ACCESS_TOKEN
    })

    describe('getPlaceName', () => {
        it('should return place name from API when not cached', async () => {
            const mockApiResponse = {
                features: [
                    {
                        place_name: 'San Francisco, California, United States',
                    },
                ],
            }

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockApiResponse),
            })

            const result = await getPlaceName({
                latitude: '37.7749',
                longitude: '-122.4194',
            })

            expect(result).toBe('San Francisco, California, United States')
            expect(mockNormalizeCoordinates).toHaveBeenCalledWith({
                latitude: '37.7749',
                longitude: '-122.4194',
            })
            expect(fetch).toHaveBeenCalledWith(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/-122.4194,37.7749.json?access_token=mock-access-token',
                { method: 'GET' }
            )
            expect(mockCacheSet).toHaveBeenCalledWith({
                key: 'mock-cache-key',
                value: 'San Francisco, California, United States',
                expire: 172800,
            })
        })

        it('should return cached result when available', async () => {
            const cachedResult = 'Cached San Francisco, CA'
            mockCacheGet.mockResolvedValue(cachedResult)

            const result = await getPlaceName({
                latitude: '37.7749',
                longitude: '-122.4194',
            })

            expect(result).toBe(cachedResult)
            expect(fetch).not.toHaveBeenCalled()
            expect(mockCacheSet).not.toHaveBeenCalled()
        })

        it('should handle API response with no features', async () => {
            const mockApiResponse = {
                features: [],
            }

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockApiResponse),
            })

            const result = await getPlaceName({
                latitude: '37.7749',
                longitude: '-122.4194',
            })

            expect(result).toBeUndefined()
            expect(mockCacheSet).toHaveBeenCalledWith({
                key: 'mock-cache-key',
                value: undefined,
                expire: 172800,
            })
        })

        it('should handle fetch errors', async () => {
            fetch.mockRejectedValue(new Error('Network error'))

            await expect(
                getPlaceName({
                    latitude: '37.7749',
                    longitude: '-122.4194',
                })
            ).rejects.toThrow('Network error')
        })

        it('should handle invalid JSON response', async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
            })

            await expect(
                getPlaceName({
                    latitude: '37.7749',
                    longitude: '-122.4194',
                })
            ).rejects.toThrow('Invalid JSON')
        })
    })

    describe('searchPlace', () => {
        it('should return search results from API when not cached', async () => {
            const mockApiResponse = {
                features: [
                    {
                        place_name: 'San Francisco, California, United States',
                        center: [-122.4194, 37.7749],
                    },
                    {
                        place_name: 'San Francisco Bay, California, United States',
                        center: [-122.3, 37.8],
                    },
                ],
            }

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockApiResponse),
            })

            const result = await searchPlace('San Francisco')

            expect(result).toEqual(mockApiResponse.features)
            expect(fetch).toHaveBeenCalledWith(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/San Francisco.json?access_token=mock-access-token',
                { method: 'GET' }
            )
            expect(mockCacheSet).toHaveBeenCalledWith({
                key: 'mock-cache-key',
                value: mockApiResponse.features,
                expire: 172800,
            })
        })

        it('should return cached search results when available', async () => {
            const cachedResults = [
                {
                    place_name: 'Cached San Francisco, CA',
                    center: [-122.4194, 37.7749],
                },
            ]
            mockCacheGet.mockResolvedValue(cachedResults)

            const result = await searchPlace('San Francisco')

            expect(result).toEqual(cachedResults)
            expect(fetch).not.toHaveBeenCalled()
            expect(mockCacheSet).not.toHaveBeenCalled()
        })

        it('should handle special characters in search query', async () => {
            const mockApiResponse = { features: [] }

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockApiResponse),
            })

            await searchPlace('São Paulo')

            expect(fetch).toHaveBeenCalledWith(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/São Paulo.json?access_token=mock-access-token',
                { method: 'GET' }
            )
        })

        it('should handle empty search results', async () => {
            const mockApiResponse = {
                features: [],
            }

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockApiResponse),
            })

            const result = await searchPlace('NonexistentPlace')

            expect(result).toEqual([])
            expect(mockCacheSet).toHaveBeenCalledWith({
                key: 'mock-cache-key',
                value: [],
                expire: 172800,
            })
        })

        it('should handle API errors', async () => {
            fetch.mockRejectedValue(new Error('MapBox API error'))

            await expect(searchPlace('San Francisco')).rejects.toThrow('MapBox API error')
        })

        it('should handle missing features in response', async () => {
            const mockApiResponse = {}

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockApiResponse),
            })

            const result = await searchPlace('Test')

            expect(result).toBeUndefined()
        })
    })
})
