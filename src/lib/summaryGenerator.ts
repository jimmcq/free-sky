import { WeatherData, WeatherInfo } from './types'

interface WeatherContext {
    temperature: number
    precipProbability: number
    precipType?: string
    windSpeed: number
    humidity: number
    uvIndex: number
    visibility: number
    icon: string
    time: number
}

interface TemperatureTrend {
    direction: 'rising' | 'falling' | 'stable'
    magnitude: 'slight' | 'moderate' | 'significant'
}

interface PrecipitationIntensity {
    type: 'light' | 'moderate' | 'heavy'
    descriptor: string
}

export class SummaryGenerator {
    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    private getTemperatureTrend(hours: WeatherData[]): TemperatureTrend {
        if (hours.length < 6) return { direction: 'stable', magnitude: 'slight' }

        const firstHalf = hours.slice(0, 3).reduce((sum, h) => sum + h.temperature, 0) / 3
        const secondHalf = hours.slice(3, 6).reduce((sum, h) => sum + h.temperature, 0) / 3
        const diff = secondHalf - firstHalf

        if (Math.abs(diff) < 3) return { direction: 'stable', magnitude: 'slight' }

        const magnitude = Math.abs(diff) > 8 ? 'significant' : Math.abs(diff) > 5 ? 'moderate' : 'slight'
        const direction = diff > 0 ? 'rising' : 'falling'

        return { direction, magnitude }
    }

    private getPrecipitationIntensity(precipProbability: number, precipType?: string): PrecipitationIntensity {
        const intensity = precipProbability < 0.3 ? 'light' : precipProbability < 0.7 ? 'moderate' : 'heavy'

        const descriptors = {
            rain: {
                light: 'light showers',
                moderate: 'steady rain',
                heavy: 'heavy downpours',
            },
            snow: {
                light: 'light snow',
                moderate: 'steady snow',
                heavy: 'heavy snow',
            },
            sleet: {
                light: 'light sleet',
                moderate: 'sleet',
                heavy: 'heavy sleet',
            },
        }

        const type = precipType?.toLowerCase() || 'rain'
        const typeDescriptors = descriptors[type as keyof typeof descriptors] || descriptors.rain

        return {
            type: intensity,
            descriptor: typeDescriptors[intensity],
        }
    }

    private getWindDescription(windSpeed: number): string {
        if (windSpeed < 5) return 'calm'
        if (windSpeed < 15) return 'breezy'
        if (windSpeed < 25) return 'windy'
        return 'very windy'
    }

    private getComfortLevel(temperature: number, humidity: number, _season: string): string {
        if (temperature < 32) return 'frigid'
        if (temperature < 45) return 'cold'
        if (temperature < 55) return 'cool'
        if (temperature < 65) return 'mild'
        if (temperature < 75) return 'pleasant'
        if (temperature < 85) {
            return humidity > 0.7 ? 'muggy' : 'warm'
        }
        return humidity > 0.6 ? 'sweltering' : 'hot'
    }

    private getCurrentSeason(): string {
        const month = new Date().getMonth()
        if (month >= 2 && month <= 4) return 'spring'
        if (month >= 5 && month <= 7) return 'summer'
        if (month >= 8 && month <= 10) return 'fall'
        return 'winter'
    }

    private getTimeOfDay(timestamp: number): string {
        const hour = new Date(timestamp * 1000).getHours()
        if (hour < 6) return 'overnight'
        if (hour < 12) return 'morning'
        if (hour < 17) return 'afternoon'
        if (hour < 21) return 'evening'
        return 'night'
    }

    generateMinutelySummary(minutely: WeatherInfo, current: WeatherContext): string {
        const currentlyRaining = current.precipProbability > 0.1
        const rainStarts = minutely.data.find(minute => minute.precipProbability > 0.1)
        const rainStops = minutely.data.find(minute => minute.precipProbability < 0.1)

        const now = Date.now() / 1000
        const minutesUntilRainStarts = rainStarts ? Math.round((rainStarts.time - now) / 60) : 0
        const minutesUntilRainStops = rainStops ? Math.round((rainStops.time - now) / 60) : 0

        // Enhanced precipitation timing logic
        if (currentlyRaining && minutesUntilRainStops > 0) {
            const intensity = this.getPrecipitationIntensity(current.precipProbability, current.precipType)
            if (minutesUntilRainStops <= 5) {
                return `${this.capitalize(intensity.descriptor)} ending shortly.`
            } else if (minutesUntilRainStops <= 20) {
                return `${this.capitalize(intensity.descriptor)} for ${minutesUntilRainStops} more minutes.`
            } else {
                return `${this.capitalize(intensity.descriptor)} continuing for the next hour.`
            }
        }

        if (!currentlyRaining && minutesUntilRainStarts > 0) {
            const intensity = this.getPrecipitationIntensity(rainStarts?.precipProbability || 0, current.precipType)
            if (minutesUntilRainStarts <= 5) {
                return `${this.capitalize(intensity.descriptor)} beginning momentarily.`
            } else if (minutesUntilRainStarts <= 20) {
                return `${this.capitalize(intensity.descriptor)} starting in ${minutesUntilRainStarts} minutes.`
            } else {
                return `${this.capitalize(intensity.descriptor)} expected within the hour.`
            }
        }

        // Enhanced fallback with weather context
        const windDesc = this.getWindDescription(current.windSpeed)
        const comfort = this.getComfortLevel(current.temperature, current.humidity, this.getCurrentSeason())

        if (windDesc !== 'calm' && comfort !== 'pleasant') {
            return `${this.capitalize(comfort)} and ${windDesc} conditions continuing.`
        } else if (windDesc !== 'calm') {
            return `${this.capitalize(windDesc)} conditions for the hour.`
        } else {
            return `${this.capitalize(comfort)} conditions continuing.`
        }
    }

    generateHourlySummary(hourly: WeatherData[], current: WeatherContext): string {
        const next6Hours = hourly.slice(0, 6)
        const trend = this.getTemperatureTrend(next6Hours)
        const timeOfDay = this.getTimeOfDay(Date.now() / 1000)

        // Check for precipitation in next 6 hours
        const precipHours = next6Hours.filter(h => h.precipProbability > 0.2)
        const avgPrecipProb = precipHours.length > 0 ? precipHours.reduce((sum, h) => sum + h.precipProbability, 0) / precipHours.length : 0

        // Temperature trend descriptions
        const tempTrendDesc = {
            rising: {
                slight: 'gradually warming',
                moderate: 'warming up',
                significant: 'becoming much warmer',
            },
            falling: {
                slight: 'gradually cooling',
                moderate: 'cooling off',
                significant: 'becoming much cooler',
            },
            stable: {
                slight: 'steady temperatures',
                moderate: 'consistent conditions',
                significant: 'stable weather',
            },
        }

        // Precipitation expected
        if (avgPrecipProb > 0.3) {
            const intensity = this.getPrecipitationIntensity(avgPrecipProb, current.precipType)
            const tempDesc = tempTrendDesc[trend.direction][trend.magnitude]
            return `${this.capitalize(intensity.descriptor)} expected with ${tempDesc}.`
        }

        // Clear conditions with temperature focus
        const avgTemp = next6Hours.reduce((sum, h) => sum + h.temperature, 0) / next6Hours.length
        const comfort = this.getComfortLevel(avgTemp, current.humidity, this.getCurrentSeason())
        const avgWind = next6Hours.reduce((sum, h) => sum + h.windSpeed, 0) / next6Hours.length
        const windDesc = this.getWindDescription(avgWind)

        if (trend.direction !== 'stable') {
            const tempDesc = tempTrendDesc[trend.direction][trend.magnitude]
            return `${this.capitalize(comfort)} conditions with ${tempDesc}.`
        }

        if (windDesc !== 'calm') {
            return `${this.capitalize(comfort)} and ${windDesc} conditions continuing.`
        }

        // Time-based context
        const timeContext = {
            morning: 'Pleasant morning conditions',
            afternoon: 'Comfortable afternoon weather',
            evening: 'Nice evening conditions',
            night: 'Calm overnight conditions',
            overnight: 'Quiet overnight weather',
        }

        return `${timeContext[timeOfDay as keyof typeof timeContext]} expected.`
    }

    generateDailySummary(daily: WeatherData[], _current: WeatherContext): string {
        const today = daily[0]
        const season = this.getCurrentSeason()

        // Temperature analysis
        const isWarmDay = today.temperatureHigh > 75
        const isColdDay = today.temperatureHigh < 45

        // Precipitation analysis
        const precipProb = today.precipProbability
        const hasPrecip = precipProb > 0.2

        // Multiple weather events detection (for future enhancement)
        // const morningIcon = today.icon
        // const afternoonIcon = today.icon // In a real implementation, you'd have hourly data

        // Comfort and seasonal context
        const comfort = this.getComfortLevel(today.temperatureHigh, today.humidity, season)
        const windDesc = this.getWindDescription(today.windSpeed)

        // Enhanced daily summary logic
        if (hasPrecip) {
            const intensity = this.getPrecipitationIntensity(precipProb, today.precipType)

            if (precipProb > 0.8) {
                return `${this.capitalize(intensity.descriptor)} throughout the day.`
            } else if (precipProb > 0.5) {
                return `Occasional ${intensity.descriptor} with ${comfort} temperatures.`
            } else {
                return `Chance of ${intensity.descriptor} in a mostly ${comfort} day.`
            }
        }

        // Clear weather with enhanced context
        if (isWarmDay && season === 'spring') {
            return `Unseasonably warm spring day.`
        }

        if (isColdDay && season === 'fall') {
            return `Crisp fall day.`
        }

        // Wind-focused summaries
        if (windDesc === 'windy' || windDesc === 'very windy') {
            return `${this.capitalize(comfort)} but ${windDesc} conditions throughout the day.`
        }

        // Seasonal defaults
        const seasonalDescriptors = {
            spring: 'Pleasant spring weather',
            summer: 'Typical summer conditions',
            fall: 'Beautiful fall day',
            winter: 'Clear winter weather',
        }

        return `${seasonalDescriptors[season as keyof typeof seasonalDescriptors]} with ${comfort} temperatures.`
    }

    generateWeeklySummary(daily: WeatherData[], current: WeatherContext): string {
        const week = daily.slice(0, 7)
        const season = this.getCurrentSeason()

        // Temperature trend analysis
        const temps = week.map(d => d.temperatureHigh)
        const tempTrend = this.analyzeWeeklyTemperatureTrend(temps)

        // Precipitation pattern analysis
        const precipDays = week.filter(d => d.precipProbability > 0.3).length
        const rainDays = week.filter(d => d.precipProbability > 0.5).length

        // Weather stability analysis
        const icons = week.map(d => d.icon)
        const uniqueIcons = [...new Set(icons)]
        const isStable = uniqueIcons.length <= 2

        // Weekend analysis
        const weekendDays = week.slice(5, 7) // Saturday and Sunday
        const weekendRain = weekendDays.filter(d => d.precipProbability > 0.3).length

        // Pattern-based summaries
        if (rainDays >= 5) {
            return `Wet week ahead with rain expected most days.`
        }

        if (rainDays >= 3) {
            if (weekendRain === 0) {
                return `Rainy midweek with clearing conditions for the weekend.`
            } else {
                return `Unsettled week with ${rainDays} rainy days expected.`
            }
        }

        if (precipDays <= 1) {
            if (tempTrend.direction === 'rising') {
                return `Clear week ahead with ${tempTrend.description}.`
            } else {
                return `Dry conditions throughout the week.`
            }
        }

        // Temperature-focused summaries
        if (tempTrend.magnitude === 'significant') {
            const precipDesc = precipDays > 2 ? 'some rain' : 'mostly dry conditions'
            return `${this.capitalize(tempTrend.description)} with ${precipDesc}.`
        }

        // Stable weather patterns
        if (isStable) {
            const avgTemp = temps.reduce((sum, t) => sum + t, 0) / temps.length
            const comfort = this.getComfortLevel(avgTemp, current.humidity, season)
            return `Stable ${comfort} conditions throughout the week.`
        }

        // Seasonal context
        const seasonalContext = {
            spring: 'Typical spring variability',
            summer: 'Variable summer weather',
            fall: 'Changeable fall conditions',
            winter: 'Unsettled winter weather',
        }

        return `${seasonalContext[season as keyof typeof seasonalContext]} with mixed conditions expected.`
    }

    private analyzeWeeklyTemperatureTrend(temps: number[]): {
        direction: 'rising' | 'falling' | 'stable'
        magnitude: 'slight' | 'moderate' | 'significant'
        description: string
    } {
        const firstHalf = temps.slice(0, 3).reduce((sum, t) => sum + t, 0) / 3
        const secondHalf = temps.slice(4, 7).reduce((sum, t) => sum + t, 0) / 3
        const diff = secondHalf - firstHalf

        if (Math.abs(diff) < 5) {
            return { direction: 'stable', magnitude: 'slight', description: 'steady temperatures' }
        }

        const magnitude = Math.abs(diff) > 15 ? 'significant' : Math.abs(diff) > 10 ? 'moderate' : 'slight'
        const direction = diff > 0 ? 'rising' : 'falling'

        const descriptions = {
            rising: {
                slight: 'gradually warming trend',
                moderate: 'warming trend',
                significant: 'significant warming trend',
            },
            falling: {
                slight: 'gradually cooling trend',
                moderate: 'cooling trend',
                significant: 'significant cooling trend',
            },
        }

        return {
            direction,
            magnitude,
            description: descriptions[direction][magnitude],
        }
    }
}

export const summaryGenerator = new SummaryGenerator()
