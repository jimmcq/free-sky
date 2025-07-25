import { WeatherData, WeatherInfo } from './types'

interface ForecastData {
    conditionCode?: string
    precipitationChance?: number
}

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
    windGustSpeedMax?: number
    sunrise?: string
    sunset?: string
    moonPhase?: string
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

    private getWindDescription(windSpeed: number, gustSpeed?: number): string {
        const hasGusts = gustSpeed && gustSpeed > windSpeed + 10

        if (windSpeed < 5) {
            return hasGusts && gustSpeed > 15 ? 'occasional gusts' : 'calm'
        }
        if (windSpeed < 15) {
            return hasGusts ? 'gusty wind' : 'breezy'
        }
        if (windSpeed < 25) {
            return hasGusts ? 'gusty wind' : 'windy'
        }
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

    private getUVWarning(uvIndex: number): string {
        if (uvIndex >= 11) return 'Extreme UV - avoid sun exposure'
        if (uvIndex >= 8) return 'Very high UV - seek shade midday'
        if (uvIndex >= 6) return 'High UV - protection recommended'
        return ''
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

    private getSolarContext(current: WeatherContext): string {
        if (!current.sunrise || !current.sunset) return ''

        const now = current.time * 1000
        const sunrise = new Date(current.sunrise).getTime()
        const sunset = new Date(current.sunset).getTime()

        const sunsetHour = new Date(current.sunset).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })

        if (now < sunrise) return `before sunrise`
        if (now > sunset) return `after sunset`
        if (sunset - now < 2 * 60 * 60 * 1000) return `until sunset at ${sunsetHour}`
        return ''
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
        const windDesc = this.getWindDescription(current.windSpeed, current.windGustSpeedMax)
        const comfort = this.getComfortLevel(current.temperature, current.humidity, this.getCurrentSeason())
        const solarContext = this.getSolarContext(current)

        if (windDesc !== 'calm' && comfort !== 'pleasant') {
            if (windDesc.includes('gusts')) {
                return `${this.capitalize(comfort)} with ${windDesc}${solarContext ? ` ${solarContext}` : ''}.`
            } else {
                return `${this.capitalize(comfort)} and ${windDesc} conditions${solarContext ? ` ${solarContext}` : ''}.`
            }
        } else if (windDesc !== 'calm') {
            if (windDesc.includes('gusts')) {
                return `${this.capitalize(windDesc)} for the hour.`
            } else {
                return `${this.capitalize(windDesc)} conditions for the hour.`
            }
        } else {
            return `${this.capitalize(comfort)} conditions${solarContext ? ` ${solarContext}` : ''}.`
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
                slight: 'gradual warming',
                moderate: 'warming up',
                significant: 'becoming much warmer',
            },
            falling: {
                slight: 'gradual cooling',
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
        const windDesc = this.getWindDescription(avgWind, current.windGustSpeedMax)

        if (trend.direction !== 'stable') {
            const tempDesc = tempTrendDesc[trend.direction][trend.magnitude]
            return `${this.capitalize(comfort)} conditions with ${tempDesc}.`
        }

        if (windDesc !== 'calm') {
            if (windDesc.includes('gusts')) {
                return `${this.capitalize(comfort)} with ${windDesc} continuing.`
            } else {
                return `${this.capitalize(comfort)} and ${windDesc} conditions continuing.`
            }
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

        // Daytime/overnight analysis
        const hasDaytimeData = today.daytimeForecast
        const hasOvernightData = today.overnightForecast

        // Comfort and seasonal context
        const comfort = this.getComfortLevel(today.temperatureHigh, today.humidity, season)
        const windDesc = this.getWindDescription(today.windSpeed, today.windGustSpeedMax)

        // Enhanced daily summary with day/night context
        if (hasPrecip) {
            const intensity = this.getPrecipitationIntensity(precipProb, today.precipType)

            if (precipProb > 0.8) {
                return `${this.capitalize(intensity.descriptor)} throughout the day.`
            } else if (precipProb > 0.5) {
                return `Occasional ${intensity.descriptor} with ${comfort} temperatures.`
            } else {
                // Check if rain is more likely day vs night
                if (hasDaytimeData && hasOvernightData) {
                    const dayRain = (today.daytimeForecast as ForecastData)?.precipitationChance || 0
                    const nightRain = (today.overnightForecast as ForecastData)?.precipitationChance || 0
                    if (dayRain > nightRain + 0.2) {
                        return `Chance of ${intensity.descriptor} during the day, clearing overnight.`
                    } else if (nightRain > dayRain + 0.2) {
                        return `Clear during the day, ${intensity.descriptor} possible overnight.`
                    }
                }
                return `Chance of ${intensity.descriptor} in a mostly ${comfort} day.`
            }
        }

        // Clear weather with enhanced day/night context
        if (hasDaytimeData && hasOvernightData) {
            const dayCondition = (today.daytimeForecast as ForecastData)?.conditionCode || ''
            const nightCondition = (today.overnightForecast as ForecastData)?.conditionCode || ''

            if (dayCondition.includes('Clear') && nightCondition.includes('Clear')) {
                const uvWarning = this.getUVWarning(today.uvIndex)
                if (uvWarning) {
                    return `Clear skies. ${uvWarning}.`
                }
                if (isWarmDay && season === 'spring') {
                    return `Unseasonably warm and clear.`
                }
                if (isColdDay && season === 'fall') {
                    return `Crisp and clear fall day.`
                }
            }
        }

        // Wind-focused summaries
        if (windDesc.includes('gusty') || windDesc.includes('gusts') || windDesc === 'very windy') {
            if (windDesc.includes('gusts')) {
                return `${this.capitalize(comfort)} with ${windDesc}.`
            } else {
                return `${this.capitalize(comfort)} but ${windDesc} conditions.`
            }
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
                slight: 'gradual warming trend',
                moderate: 'warming trend',
                significant: 'significant warming trend',
            },
            falling: {
                slight: 'gradual cooling trend',
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
