import { bearingToCardinal, normalizeCoordinates, normalizeIcon, normalizeIconWithDayNight } from '../../src/lib/helpers'

describe('bearingToCardinal', () => {
    it('should return "N" for 0 and 360 degrees', () => {
        expect.assertions(2)
        expect(bearingToCardinal(0)).toBe('N')
        expect(bearingToCardinal(360)).toBe('N')
    })
    it('should return "NE" for 45 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(45)).toBe('NE')
    })
    it('should return "E" for 90 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(90)).toBe('E')
    })
    it('should return "SE" for 135 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(135)).toBe('SE')
    })
    it('should return "S" for 180 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(180)).toBe('S')
    })
    it('should return "SW" for 225 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(225)).toBe('SW')
    })
    it('should return "W" for 270 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(270)).toBe('W')
    })
    it('should return "NW" for 315 degrees', () => {
        expect.assertions(1)
        expect(bearingToCardinal(315)).toBe('NW')
    })
})

describe('normalizeCoordinates', () => {
    it('should return the same coordinates extended to 4 decimals for valid coordinates', () => {
        expect.assertions(1)
        expect(normalizeCoordinates({ latitude: 0, longitude: 0 })).toEqual({
            latitude: '0.0000',
            longitude: '0.0000',
        })
    })
    it('should return the same coordinates shortened to 4 decimals for valid coordinates', () => {
        expect.assertions(1)
        expect(normalizeCoordinates({ latitude: 0.123456789, longitude: 0.123456789 })).toEqual({
            latitude: '0.1235',
            longitude: '0.1235',
        })
    })
    it('should throw an error for invalid coordinates', () => {
        expect.assertions(1)
        expect(() => normalizeCoordinates({ latitude: 0, longitude: 200 })).toThrow('Invalid location coordinates')
    })

    it('should work with string input', () => {
        expect.assertions(2)
        let { latitude, longitude } = normalizeCoordinates({ latitude: '52.520008', longitude: '13.404954' })
        expect(latitude).toEqual('52.5200')
        expect(longitude).toEqual('13.4050')
    })
})

describe('normalizeIcon', () => {
    it('should return a normalized string for valid icons', () => {
        expect.assertions(1)
        expect(normalizeIcon('clear-day')).toBe('CLEAR_DAY')
    })
    it('should return the default icon for invalid icons', () => {
        expect.assertions(1)
        expect(normalizeIcon('invalid-icon')).toBe('FOG')
    })
})

describe('normalizeIconWithDayNight', () => {
    // Test daytime scenarios
    describe('during daytime', () => {
        it('should return day icon for clear weather at noon in New York', () => {
            expect.assertions(1)
            // December 15, 2024 at 12:00 PM EST (17:00 UTC)
            const currentTime = 1734360000 // Unix timestamp for 2024-12-15 17:00:00 UTC
            const sunrise = '2024-12-15T07:15:00-05:00' // 7:15 AM EST
            const sunset = '2024-12-15T16:30:00-05:00' // 4:30 PM EST
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Clear', currentTime, timezone, sunrise, sunset)).toBe('CLEAR_DAY')
        })

        it('should return day icon for partly cloudy weather at 10 AM in Tokyo', () => {
            expect.assertions(1)
            // December 15, 2024 at 10:00 AM JST (01:00 UTC)
            const currentTime = 1734321600 // Unix timestamp for 2024-12-15 01:00:00 UTC
            const sunrise = '2024-12-15T06:45:00+09:00' // 6:45 AM JST
            const sunset = '2024-12-15T16:30:00+09:00' // 4:30 PM JST
            const timezone = 'Asia/Tokyo'
            
            expect(normalizeIconWithDayNight('PartlyCloudy', currentTime, timezone, sunrise, sunset)).toBe('PARTLY_CLOUDY_DAY')
        })
    })

    // Test nighttime scenarios
    describe('during nighttime', () => {
        it('should return night icon for clear weather at 11 PM in New York', () => {
            expect.assertions(1)
            // December 15, 2024 at 11:00 PM EST (04:00 UTC next day)
            const currentTime = 1734400800 // Unix timestamp for 2024-12-16 04:00:00 UTC
            const sunrise = '2024-12-15T07:15:00-05:00' // 7:15 AM EST
            const sunset = '2024-12-15T16:30:00-05:00' // 4:30 PM EST
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Clear', currentTime, timezone, sunrise, sunset)).toBe('CLEAR_NIGHT')
        })

        it('should return night icon for partly cloudy weather at 2 AM in Tokyo', () => {
            expect.assertions(1)
            // December 15, 2024 at 2:00 AM JST (previous day 17:00 UTC)
            const currentTime = 1734278400 // Unix timestamp for 2024-12-14 17:00:00 UTC
            const sunrise = '2024-12-15T06:45:00+09:00' // 6:45 AM JST
            const sunset = '2024-12-15T16:30:00+09:00' // 4:30 PM JST
            const timezone = 'Asia/Tokyo'
            
            expect(normalizeIconWithDayNight('PartlyCloudy', currentTime, timezone, sunrise, sunset)).toBe('PARTLY_CLOUDY_NIGHT')
        })

        it('should return night icon for rain at midnight', () => {
            expect.assertions(1)
            // December 15, 2024 at 12:00 AM EST (05:00 UTC)
            const currentTime = 1734318000 // Unix timestamp for 2024-12-15 05:00:00 UTC
            const sunrise = '2024-12-15T07:15:00-05:00' // 7:15 AM EST
            const sunset = '2024-12-15T16:30:00-05:00' // 4:30 PM EST
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Rain', currentTime, timezone, sunrise, sunset)).toBe('SHOWERS_NIGHT')
        })

        it('should return night icon for snow during early morning hours', () => {
            expect.assertions(1)
            // December 15, 2024 at 5:00 AM EST (10:00 UTC)
            const currentTime = 1734336000 // Unix timestamp for 2024-12-15 10:00:00 UTC
            const sunrise = '2024-12-15T07:15:00-05:00' // 7:15 AM EST
            const sunset = '2024-12-15T16:30:00-05:00' // 4:30 PM EST
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Snow', currentTime, timezone, sunrise, sunset)).toBe('SNOW_SHOWERS_NIGHT')
        })

        it('should return night icon for thunderstorms in the evening', () => {
            expect.assertions(1)
            // December 15, 2024 at 8:00 PM EST (01:00 UTC next day)
            const currentTime = 1734390000 // Unix timestamp for 2024-12-16 01:00:00 UTC
            const sunrise = '2024-12-15T07:15:00-05:00' // 7:15 AM EST
            const sunset = '2024-12-15T16:30:00-05:00' // 4:30 PM EST
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Thunderstorms', currentTime, timezone, sunrise, sunset)).toBe('THUNDER_SHOWERS_NIGHT')
        })
    })

    // Test edge cases and boundary conditions
    describe('edge cases', () => {
        it('should return day icon for weather conditions without night variants', () => {
            expect.assertions(2)
            // Testing fog and wind which don't have night variants
            const currentTime = 1734400800 // Nighttime
            const sunrise = '2024-12-15T07:15:00-05:00'
            const sunset = '2024-12-15T16:30:00-05:00'
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Fog', currentTime, timezone, sunrise, sunset)).toBe('FOG')
            expect(normalizeIconWithDayNight('Windy', currentTime, timezone, sunrise, sunset)).toBe('WIND')
        })

        it('should return day icon when sunrise/sunset data is missing', () => {
            expect.assertions(2)
            const currentTime = 1734400800 // Nighttime
            const timezone = 'America/New_York'
            
            expect(normalizeIconWithDayNight('Clear', currentTime, timezone, undefined, undefined)).toBe('CLEAR_DAY')
            expect(normalizeIconWithDayNight('Clear', currentTime, timezone, null, null)).toBe('CLEAR_DAY')
        })

        it('should handle different timezone formats correctly', () => {
            expect.assertions(3)
            // Test with various timezone formats
            const currentTime = 1734400800 // Nighttime
            const sunrise = '2024-12-15T07:15:00-05:00'
            const sunset = '2024-12-15T16:30:00-05:00'
            
            expect(normalizeIconWithDayNight('Clear', currentTime, 'America/New_York', sunrise, sunset)).toBe('CLEAR_NIGHT')
            expect(normalizeIconWithDayNight('Clear', currentTime, 'Asia/Tokyo', sunrise, sunset)).toBe('CLEAR_NIGHT')
            expect(normalizeIconWithDayNight('Clear', currentTime, 'Europe/London', sunrise, sunset)).toBe('CLEAR_NIGHT')
        })
    })

    // Test real-world scenarios from the issue
    describe('real-world scenarios', () => {
        it('should show day icons for Kyoto at 12:37 PM local time', () => {
            expect.assertions(1)
            // Simulating when it's 12:37 PM in Kyoto (3:37 AM UTC)
            const currentTime = Math.floor(new Date('2024-12-15T03:37:00Z').getTime() / 1000)
            const sunrise = '2024-12-15T06:45:00+09:00'
            const sunset = '2024-12-15T16:30:00+09:00'
            const timezone = 'Asia/Tokyo'
            
            expect(normalizeIconWithDayNight('Clear', currentTime, timezone, sunrise, sunset)).toBe('CLEAR_DAY')
        })

        it('should show night icons for Cayman Islands at 11:31 PM local time', () => {
            expect.assertions(1)
            // Simulating when it's 11:31 PM in Cayman Islands (4:31 AM UTC next day)
            const currentTime = Math.floor(new Date('2024-12-16T04:31:00Z').getTime() / 1000)
            const sunrise = '2024-12-15T06:30:00-05:00'
            const sunset = '2024-12-15T17:45:00-05:00'
            const timezone = 'America/Cayman'
            
            expect(normalizeIconWithDayNight('Clear', currentTime, timezone, sunrise, sunset)).toBe('CLEAR_NIGHT')
        })
    })
})
