import { ColorSkyconsType } from 'react-color-skycons'

function normalizeCoordinates({ latitude, longitude }: { latitude: string; longitude: string }) {
    const floatLatitude: number = parseFloat(latitude)
    const floatLongitude: number = parseFloat(longitude)

    if (
        isNaN(floatLatitude) ||
        isNaN(floatLongitude) ||
        floatLatitude < -90 ||
        floatLatitude > 90 ||
        floatLongitude < -180 ||
        floatLongitude > 180
    ) {
        throw new Error('Invalid location coordinates')
    }

    const normalizedLatitude: string = floatLatitude.toFixed(4)
    const normalizedLongitude: string = floatLongitude.toFixed(4)

    return { latitude: normalizedLatitude, longitude: normalizedLongitude }
}

function normalizeIcon(icon: string): keyof typeof ColorSkyconsType {
    const iconType = icon
        .replace(/([^ ])([A-Z])/g, '$1 $2')
        .trim()
        .replace(/[- ]/g, '_')
        .toUpperCase() as keyof typeof ColorSkyconsType

    if (Object.keys(ColorSkyconsType).includes(iconType)) {
        return iconType
    }

    switch (icon.replace(/\s+/g, '')) {
        case 'Clear':
        case 'Clear,Sunny':
        case 'MostlyClear':
            return 'CLEAR_DAY'
        case 'PartlyCloudy':
        case 'MostlyCloudy':
            return 'PARTLY_CLOUDY_DAY'
        case 'Haze':
            return 'FOG'
        case 'Drizzle':
        case 'LightRain':
            return 'RAIN'
        case 'Flurries':
        case 'LightSnow':
        case 'HeavySnow':
            return 'SNOW'
        case 'Windy':
            return 'WIND'
        case 'Thunderstorms':
            return 'THUNDER'
        default:
            return 'FOG'
    }
}

function isNightTime(currentTime: number, timezone: string, sunrise?: string, sunset?: string): boolean {
    if (!sunrise || !sunset) {
        return false
    }

    // Convert all times to the location's timezone for comparison
    const now = new Date(currentTime * 1000)
    const sunriseDate = new Date(sunrise)
    const sunsetDate = new Date(sunset)

    // Get current time in location's timezone
    const currentInLocation = new Date(now.toLocaleString('en-US', { timeZone: timezone }))

    // Convert sunrise and sunset to location's timezone
    const sunriseInLocation = new Date(sunriseDate.toLocaleString('en-US', { timeZone: timezone }))
    const sunsetInLocation = new Date(sunsetDate.toLocaleString('en-US', { timeZone: timezone }))

    // Get today's date in the location's timezone to compare same-day times
    const todayInLocation = new Date(currentInLocation.getFullYear(), currentInLocation.getMonth(), currentInLocation.getDate())
    const currentTimeOfDay = currentInLocation.getTime() - todayInLocation.getTime()
    const sunriseTimeOfDay = sunriseInLocation.getHours() * 3600000 + sunriseInLocation.getMinutes() * 60000
    const sunsetTimeOfDay = sunsetInLocation.getHours() * 3600000 + sunsetInLocation.getMinutes() * 60000

    return currentTimeOfDay < sunriseTimeOfDay || currentTimeOfDay > sunsetTimeOfDay
}

function normalizeIconWithDayNight(
    icon: string,
    currentTime: number,
    timezone: string,
    sunrise?: string,
    sunset?: string
): keyof typeof ColorSkyconsType {
    const baseIcon = normalizeIcon(icon)

    if (!isNightTime(currentTime, timezone, sunrise, sunset)) {
        return baseIcon
    }

    // Convert day icons to night variants when it's nighttime
    switch (baseIcon) {
        case 'CLEAR_DAY':
            return 'CLEAR_NIGHT'
        case 'PARTLY_CLOUDY_DAY':
            return 'PARTLY_CLOUDY_NIGHT'
        case 'RAIN':
            return 'SHOWERS_NIGHT'
        case 'SNOW':
            return 'SNOW_SHOWERS_NIGHT'
        case 'THUNDER':
            return 'THUNDER_SHOWERS_NIGHT'
        default:
            return baseIcon
    }
}

function normalizeSummary(summary: string): string {
    return summary
        .replace(/([^ ])([A-Z])/g, '$1 $2') // Add spaces
        .replace(/U V/g, 'UV') // Fix UV specifically
        .trim()
}

function bearingToCardinal(bearing: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.floor((bearing + 22.5) / 45)
    return directions[index % 8]
}

function celsiusToFahrenheit(celsius: number): number {
    return celsius * 1.8 + 32
}

function kilometersToMiles(kilometers: number): number {
    return kilometers * 0.621371
}

function millimetersToInches(millimeters: number): number {
    return millimeters * 0.0393701
}

export {
    normalizeCoordinates,
    normalizeIcon,
    normalizeIconWithDayNight,
    normalizeSummary,
    bearingToCardinal,
    celsiusToFahrenheit,
    kilometersToMiles,
    millimetersToInches,
}
