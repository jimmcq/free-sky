import { requestLocationPermission, getCurrentPosition } from '../../src/lib/location'

// Mock navigator.geolocation and navigator.permissions
const mockGeolocation = {
    getCurrentPosition: jest.fn(),
}

const mockPermissions = {
    query: jest.fn(),
}

Object.defineProperty(global, 'navigator', {
    value: {
        geolocation: mockGeolocation,
        permissions: mockPermissions,
    },
    writable: true,
})

describe('location utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('requestLocationPermission', () => {
        it('should return permission state when permissions API is available', async () => {
            mockPermissions.query.mockResolvedValue({ state: 'granted' })

            const result = await requestLocationPermission()

            expect(result).toBe('granted')
            expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'geolocation' })
        })

        it('should return denied permission state', async () => {
            mockPermissions.query.mockResolvedValue({ state: 'denied' })

            const result = await requestLocationPermission()

            expect(result).toBe('denied')
            expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'geolocation' })
        })

        it('should return prompt permission state', async () => {
            mockPermissions.query.mockResolvedValue({ state: 'prompt' })

            const result = await requestLocationPermission()

            expect(result).toBe('prompt')
            expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'geolocation' })
        })

        it('should return granted when permissions API is not available', async () => {
            // Remove permissions from navigator
            global.navigator = {
                geolocation: mockGeolocation,
            }

            const result = await requestLocationPermission()

            expect(result).toBe('granted')
        })

        it('should throw error when geolocation is not supported', async () => {
            global.navigator = {}

            await expect(requestLocationPermission()).rejects.toThrow('Geolocation is not supported by this browser')
        })

        it('should handle permissions API errors', async () => {
            global.navigator = {
                geolocation: mockGeolocation,
                permissions: mockPermissions,
            }
            const permissionError = new Error('Permission query failed')
            mockPermissions.query.mockRejectedValue(permissionError)

            await expect(requestLocationPermission()).rejects.toThrow('Permission query failed')
        })
    })

    describe('getCurrentPosition', () => {
        beforeEach(() => {
            global.navigator = {
                geolocation: mockGeolocation,
                permissions: mockPermissions,
            }
        })

        it('should return current position when successful', async () => {
            const mockPosition = {
                coords: {
                    latitude: 37.7749,
                    longitude: -122.4194,
                },
            }

            mockGeolocation.getCurrentPosition.mockImplementation(success => {
                success(mockPosition)
            })

            const result = await getCurrentPosition()

            expect(result).toEqual({
                coords: {
                    latitude: 37.7749,
                    longitude: -122.4194,
                },
            })
            expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            })
        })

        it('should reject when geolocation fails', async () => {
            const mockError = new Error('Position unavailable')

            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error(mockError)
            })

            await expect(getCurrentPosition()).rejects.toThrow('Position unavailable')
        })

        it('should throw error when geolocation is not supported', async () => {
            global.navigator = {}

            await expect(getCurrentPosition()).rejects.toThrow('Geolocation is not supported by this browser')
        })

        it('should handle timeout errors', async () => {
            const timeoutError = new Error('Timeout')
            timeoutError.code = 3 // TIMEOUT

            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error(timeoutError)
            })

            await expect(getCurrentPosition()).rejects.toThrow('Timeout')
        })

        it('should handle permission denied errors', async () => {
            const permissionError = new Error('Permission denied')
            permissionError.code = 1 // PERMISSION_DENIED

            mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
                error(permissionError)
            })

            await expect(getCurrentPosition()).rejects.toThrow('Permission denied')
        })
    })
})
