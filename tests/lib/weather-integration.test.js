import { normalizeCoordinates } from '../../src/lib/helpers'
import { safeKey } from '../../src/lib/cache'

// Simple integration tests for weather-related utilities
describe('Weather Integration Tests', () => {
    describe('Coordinate normalization flow', () => {
        it('should handle valid coordinate strings', () => {
            const result = normalizeCoordinates({
                latitude: '37.7749',
                longitude: '-122.4194',
            })

            expect(result.latitude).toBe('37.7749')
            expect(result.longitude).toBe('-122.4194')
        })

        it('should handle coordinate precision', () => {
            const result = normalizeCoordinates({
                latitude: '37.774929',
                longitude: '-122.419416',
            })

            expect(result.latitude).toBe('37.7749')
            expect(result.longitude).toBe('-122.4194')
        })

        it('should throw for invalid coordinates', () => {
            expect(() => {
                normalizeCoordinates({
                    latitude: 'invalid',
                    longitude: 'invalid',
                })
            }).toThrow('Invalid location coordinates')
        })
    })

    describe('Cache key generation', () => {
        it('should generate safe cache keys for weather data', () => {
            const key = safeKey('weatherkit/37.7749,-122.4194')

            expect(typeof key).toBe('string')
            expect(key.length).toBeGreaterThan(0)
            // Cache key should be a transformed version of the input
            expect(key).toBeDefined()
        })

        it('should handle special characters in cache keys', () => {
            const key = safeKey('weatherkit/São Paulo, Brazil')

            expect(typeof key).toBe('string')
            expect(key.length).toBeGreaterThan(0)
        })
    })

    describe('Error handling integration', () => {
        it('should handle boundary coordinate values', () => {
            const extremeCoords = normalizeCoordinates({
                latitude: '90',
                longitude: '180',
            })

            expect(extremeCoords.latitude).toBe('90.0000')
            expect(extremeCoords.longitude).toBe('180.0000')
        })

        it('should handle negative boundary values', () => {
            const extremeCoords = normalizeCoordinates({
                latitude: '-90',
                longitude: '-180',
            })

            expect(extremeCoords.latitude).toBe('-90.0000')
            expect(extremeCoords.longitude).toBe('-180.0000')
        })
    })
})
