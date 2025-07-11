import * as fs from 'fs'
import WeatherKit, { isErr, WeatherKitResponse } from 'node-apple-weatherkit'

// Extend the Day type to include missing properties
interface ExtendedDay {
    windSpeedAvg?: number
    windGustSpeedMax?: number
    [key: string]: unknown
}
import { cacheGet, cacheSet, safeKey } from './cache'
import { celsiusToFahrenheit, kilometersToMiles, millimetersToInches, normalizeCoordinates, normalizeSummary } from './helpers'
import { emptyData, emptyWeatherResponse } from './types'
import { summaryGenerator } from './summaryGenerator'
import { getTimezoneFromCoordinates } from './timezoneUtils'

// Using the WeatherKit library's types directly

function translateToDarkSky(weatherkit: WeatherKitResponse) {
    const darkSky = emptyWeatherResponse

    darkSky.minutely.summary = ''
    darkSky.hourly.summary = ''
    darkSky.daily.summary = ''

    darkSky.latitude = weatherkit.currentWeather?.metadata.latitude || 0
    darkSky.longitude = weatherkit.currentWeather?.metadata.longitude || 0
    // WeatherKit doesn't provide timezone directly, so we'll determine it from coordinates
    darkSky.timezone = getTimezoneFromCoordinates(darkSky.latitude, darkSky.longitude)

    darkSky.currently.time = Date.parse(weatherkit.currentWeather?.metadata.readTime || '') / 1000
    darkSky.currently.icon = weatherkit.currentWeather?.conditionCode || ''
    darkSky.currently.summary = weatherkit.currentWeather?.conditionCode || ''
    darkSky.currently.precipIntensity = millimetersToInches(weatherkit.currentWeather?.precipitationIntensity || 0)
    darkSky.currently.precipProbability = 0 // Not available in current weather
    darkSky.currently.precipType = 'rain' // Not available in current weather
    darkSky.currently.temperature = celsiusToFahrenheit(weatherkit.currentWeather?.temperature || 0)
    darkSky.currently.apparentTemperature = celsiusToFahrenheit(weatherkit.currentWeather?.temperatureApparent || 0)
    darkSky.currently.windSpeed = kilometersToMiles(weatherkit.currentWeather?.windSpeed || 0)
    darkSky.currently.windBearing = weatherkit.currentWeather?.windDirection || 0
    darkSky.currently.humidity = weatherkit.currentWeather?.humidity || 0
    darkSky.currently.uvIndex = weatherkit.currentWeather?.uvIndex || 0
    darkSky.currently.visibility = kilometersToMiles(weatherkit.currentWeather?.visibility || 10)

    // Note: forecastNextHour is not available in the current WeatherKit library
    darkSky.minutely.data = []

    const now = new Date()
    const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()).getTime()
    const aDayFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, now.getHours()).getTime()

    darkSky.hourly.data =
        weatherkit.forecastHourly?.hours
            ?.filter(hour => Date.parse(hour.forecastStart) >= startOfHour && Date.parse(hour.forecastStart) <= aDayFromNow)
            ?.map(hour => {
                return {
                    ...emptyData,
                    time: Date.parse(hour.forecastStart || '') / 1000,
                    icon: hour.conditionCode || '',
                    summary: hour.conditionCode || '',
                    precipIntensity: millimetersToInches(hour.precipitationIntensity || 0),
                    precipProbability: hour.precipitationChance || 0,
                    precipType: 'rain', // Default precipType, not available in hourly forecast
                    temperature: celsiusToFahrenheit(hour.temperature || 0),
                    apparentTemperature: celsiusToFahrenheit(hour.temperatureApparent || 0),
                    windSpeed: kilometersToMiles(hour.windSpeed || 0),
                    windBearing: hour.windDirection || 0,
                    humidity: hour.humidity || 0,
                    uvIndex: hour.uvIndex || 0,
                    visibility: 10, // Default visibility
                }
            }) || []

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    darkSky.daily.data =
        weatherkit.forecastDaily?.days
            .filter(day => Date.parse(day.forecastStart) >= startOfDay)
            .map(day => {
                const dayData = {
                    ...emptyData,
                    time: Date.parse(day?.forecastStart || '') / 1000,
                    icon: day?.conditionCode || '',
                    summary: day?.conditionCode || '',
                    precipIntensity: millimetersToInches(day?.precipitationAmount || 0),
                    precipProbability: day?.precipitationChance || 0,
                    precipType: 'rain', // Default precipType, not available in daily forecast
                    temperatureLow: celsiusToFahrenheit(day?.temperatureMin || 0),
                    temperatureHigh: celsiusToFahrenheit(day?.temperatureMax || 0),
                    temperature: celsiusToFahrenheit(day?.temperatureMax || 0),
                    apparentTemperature: celsiusToFahrenheit(day?.temperatureMax || 0),
                    humidity: 0.5, // Default humidity, not available in daily forecast
                    windSpeed: (day as unknown as ExtendedDay)?.windSpeedAvg
                        ? kilometersToMiles((day as unknown as ExtendedDay).windSpeedAvg || 0)
                        : 0,
                    windBearing: 0, // Default windBearing, not available in daily forecast
                    uvIndex: day?.maxUvIndex || 0,
                    visibility: 10,
                    windGustSpeedMax: (day as unknown as ExtendedDay)?.windGustSpeedMax
                        ? kilometersToMiles((day as unknown as ExtendedDay).windGustSpeedMax || 0)
                        : undefined,
                    daytimeForecast: day?.daytimeForecast,
                    overnightForecast: day?.overnightForecast,
                }

                // Generate enhanced daily summary for individual days
                const currentContext = {
                    temperature: dayData.temperatureHigh,
                    precipProbability: dayData.precipProbability,
                    precipType: dayData.precipType,
                    windSpeed: dayData.windSpeed,
                    humidity: dayData.humidity,
                    uvIndex: dayData.uvIndex,
                    visibility: 10,
                    icon: dayData.icon,
                    time: dayData.time,
                    windGustSpeedMax: dayData.windGustSpeedMax,
                    sunrise: day?.sunrise,
                    sunset: day?.sunset,
                    moonPhase: day?.moonPhase,
                }

                dayData.summary = summaryGenerator.generateDailySummary([dayData], currentContext)

                return dayData
            }) || []

    // Note: weatherAlerts is not available in the current WeatherKit library
    darkSky.alerts = []

    // Enhanced summary generation using the new summary generator
    const currentWeatherContext = {
        temperature: darkSky.currently.temperature,
        precipProbability: darkSky.currently.precipProbability,
        precipType: darkSky.currently.precipType,
        windSpeed: darkSky.currently.windSpeed,
        humidity: darkSky.currently.humidity,
        uvIndex: darkSky.currently.uvIndex,
        visibility: darkSky.currently.visibility,
        icon: darkSky.currently.icon,
        time: darkSky.currently.time,
        windGustSpeedMax: weatherkit.currentWeather?.windGust ? kilometersToMiles(weatherkit.currentWeather.windGust) : undefined,
        sunrise: weatherkit.forecastDaily?.days?.[0]?.sunrise,
        sunset: weatherkit.forecastDaily?.days?.[0]?.sunset,
        moonPhase: weatherkit.forecastDaily?.days?.[0]?.moonPhase,
    }

    // Generate enhanced minutely summary
    if (darkSky.minutely.data.length > 0) {
        darkSky.minutely.summary = summaryGenerator.generateMinutelySummary(darkSky.minutely, currentWeatherContext)
    }

    // Generate enhanced hourly summary
    if (darkSky.hourly.data.length > 0) {
        darkSky.hourly.summary = summaryGenerator.generateHourlySummary(darkSky.hourly.data, currentWeatherContext)
    }

    // If there is no minutely summary, use the hourly summary
    if (!darkSky.minutely.summary) {
        darkSky.minutely.summary = `${normalizeSummary(darkSky.hourly.data[0]?.summary) || ''} for the hour.`
    }

    // Generate enhanced daily/weekly summary
    if (darkSky.daily.data.length > 0) {
        darkSky.daily.summary = summaryGenerator.generateWeeklySummary(darkSky.daily.data, currentWeatherContext)
    }

    return darkSky
}

async function getForecast({ latitude: latitudeParam, longitude: longitudeParam }: { latitude: string; longitude: string }) {
    const { latitude, longitude } = normalizeCoordinates({ latitude: latitudeParam, longitude: longitudeParam })

    const cacheKey = safeKey(`weatherkit/${latitude},${longitude}`)
    // Check the cache
    const result = await cacheGet(cacheKey)
    if (result) {
        return result
    }

    // Support both direct key content and file path
    let key
    try {
        if (process.env.APPLE_WEATHERKIT_KEY) {
            // Use key content directly from environment variable
            key = process.env.APPLE_WEATHERKIT_KEY
        } else {
            // Fall back to reading from file path
            const keyPath = process.env.APPLE_WEATHERKIT_KEY_PATH || `AuthKey_${process.env.APPLEKEYID}.p8`
            key = fs.readFileSync(keyPath, 'utf8')
        }
    } catch (_e) {
        // No valid key available, return empty response
        return emptyWeatherResponse
    }
    try {
        const defaultAuth = {
            teamId: process.env.APPLETEAMID || '',
            serviceId: 'net.free-sky.weatherkit',
            keyId: process.env.APPLEKEYID || '',
            key: key,
        }
        const wk = new WeatherKit(defaultAuth)
        const availability = await wk.availability.get(parseFloat(latitude), parseFloat(longitude))

        if (!isErr(availability)) {
            const weather = await wk.weather.get(parseFloat(latitude), parseFloat(longitude), { dataSets: availability })
            if (!isErr(weather)) {
                const darkSky = translateToDarkSky(weather)
                cacheSet({ key: cacheKey, value: darkSky, expire: 60 })
                return darkSky
            }
        } else {
            // Error: Cannot get location available datasets
        }
    } catch (_e) {
        // Error calling WeatherKit API
    }
    return emptyWeatherResponse
}

export { getForecast }
