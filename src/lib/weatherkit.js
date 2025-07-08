import * as fs from 'fs'
import WeatherKit, { isErr } from 'node-apple-weatherkit'
import { cacheGet, cacheSet, safeKey } from './cache'
import {
    celsiusToFahrenheit,
    kilometersToMiles,
    millimetersToInches,
    normalizeCoordinates,
    normalizeIcon,
    normalizeSummary,
} from './helpers'
import { emptyData, emptyWeatherResponse } from './types'

function translateToDarkSky(weatherkit) {
    const darkSky = emptyWeatherResponse

    darkSky.minutely.summary = ''
    darkSky.hourly.summary = ''
    darkSky.daily.summary = ''

    darkSky.latitude = weatherkit.currentWeather?.metadata.latitude || 0
    darkSky.longitude = weatherkit.currentWeather?.metadata.longitude || 0

    darkSky.currently.time = Date.parse(weatherkit.currentWeather?.metadata.readTime || '') / 1000
    darkSky.currently.icon = weatherkit.currentWeather?.conditionCode || ''
    darkSky.currently.summary = weatherkit.currentWeather?.summary || weatherkit.currentWeather?.conditionCode || ''
    darkSky.currently.precipIntensity = millimetersToInches(weatherkit.currentWeather?.precipitationIntensity || 0)
    darkSky.currently.temperature = celsiusToFahrenheit(weatherkit.currentWeather?.temperature || 0)
    darkSky.currently.apparentTemperature = celsiusToFahrenheit(weatherkit.currentWeather?.temperatureApparent || 0)
    darkSky.currently.windSpeed = kilometersToMiles(weatherkit.currentWeather?.windSpeed || 0)
    darkSky.currently.windBearing = weatherkit.currentWeather?.windDirection || 0

    darkSky.minutely.data =
        weatherkit.forecastNextHour?.minutes.slice(0, 60).map(minute => {
            return {
                ...emptyData,
                time: Date.parse(minute.startTime || '') / 1000,
                precipIntensity: millimetersToInches(minute.precipitationIntensity || 0),
                precipProbability: minute.precipitationChance || 0,
            }
        }) || []

    const now = new Date()
    const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()).getTime()
    const aDayFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, now.getHours()).getTime()

    darkSky.hourly.data =
        weatherkit.forecastHourly.hours
            .filter(hour => Date.parse(hour.forecastStart) >= startOfHour && Date.parse(hour.forecastStart) <= aDayFromNow)
            .map(hour => {
                return {
                    ...emptyData,
                    time: Date.parse(hour.forecastStart || '') / 1000,
                    summary: hour?.summary || hour?.conditionCode || '',
                    precipIntensity: millimetersToInches(hour.precipitationIntensity || 0),
                    precipProbability: hour.precipitationChance || 0,
                    temperature: celsiusToFahrenheit(hour.temperature || 0),
                }
            }) || []

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    darkSky.daily.data =
        weatherkit.forecastDaily?.days
            .filter(day => Date.parse(day.forecastStart) >= startOfDay)
            .map(day => {
                let summary = day?.summary
                if (!summary) {
                    summary = `${day?.conditionCode} throughout the day.`
                    if (
                        day.overnightForecast?.conditionCode &&
                        day.daytimeForecast?.conditionCode !== day.overnightForecast?.conditionCode
                    ) {
                        summary = `${day.daytimeForecast?.conditionCode}, then ${day.overnightForecast?.conditionCode} overnight.`
                    }
                }
                return {
                    ...emptyData,
                    time: Date.parse(day.forecastStart || '') / 1000,
                    icon: day?.conditionCode || '',
                    summary,
                    precipIntensity: millimetersToInches(day.precipitationAmount || 0),
                    precipProbability: day.precipitationChance || 0,
                    temperatureLow: celsiusToFahrenheit(day.temperatureMin || 0),
                    temperatureHigh: celsiusToFahrenheit(day.temperatureMax || 0),
                }
            }) || []

    darkSky.alerts =
        weatherkit.weatherAlerts?.map(alert => {
            return {
                title: alert.title || '',
                description: alert.description || '',
                uri: alert.uri || '',
                expires: Date.parse(alert.expires || '') / 1000,
            }
        }) || []

    // Calculate the minutely summary
    if (darkSky.minutely.data.length > 0) {
        const rainStarts = darkSky.minutely.data.find(minute => minute.precipProbability > 0)
        const rainStops = darkSky.minutely.data.find(minute => minute.precipProbability === 0)
        let minutesUntilRainStarts = 0
        let minutesUntilRainStops = 0
        if (rainStarts) {
            minutesUntilRainStarts = Math.round((rainStarts.time - now.getTime() / 1000) / 60)
        }
        if (rainStops) {
            minutesUntilRainStops = Math.round((rainStops.time - now.getTime() / 1000) / 60)
        }
        if (minutesUntilRainStarts > 0 && minutesUntilRainStops > 0 && minutesUntilRainStarts < minutesUntilRainStops) {
            darkSky.minutely.summary = `Rain starts in ${minutesUntilRainStarts} minutes and stops in ${minutesUntilRainStops} minute${
                minutesUntilRainStops > 1 ? 's' : ''
            }.`
        } else if (minutesUntilRainStarts > 0 && minutesUntilRainStops > 0 && minutesUntilRainStarts > minutesUntilRainStops) {
            darkSky.minutely.summary = `Rain stops in ${minutesUntilRainStops} minutes and starts in ${minutesUntilRainStarts} minute${
                minutesUntilRainStarts > 1 ? 's' : ''
            }.`
        } else if (minutesUntilRainStarts > 0) {
            darkSky.minutely.summary = `Rain starts in ${minutesUntilRainStarts} minute${minutesUntilRainStarts > 1 ? 's' : ''}.`
        } else if (minutesUntilRainStops > 0) {
            darkSky.minutely.summary = `Rain stops in ${minutesUntilRainStops} minute${minutesUntilRainStops > 1 ? 's' : ''}.`
        }
    }

    // If there is no minutely summary, use the hourly summary
    if (!darkSky.minutely.summary) {
        darkSky.minutely.summary = `${normalizeSummary(darkSky.hourly.data[0]?.summary) || ''} for the hour.`
    }

    // If there is no hourly summary, use the daily summary
    if (!darkSky.hourly.summary) {
        darkSky.hourly.summary = normalizeSummary(darkSky.daily.data[0]?.summary) || ''
    }

    /*
    Calculate darkSky.daily.summary
  */

    const firstDifferentIconIndex = darkSky.daily.data
        .slice(0, 7)
        .findIndex(day => normalizeIcon(day.icon) !== normalizeIcon(darkSky.daily.data[0].icon))
    if (firstDifferentIconIndex === -1) {
        darkSky.daily.summary = `${normalizeSummary(darkSky.daily.data[0]?.icon)} throughout the week.`
    } else {
        darkSky.daily.summary = ''
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const firstRainIndex = darkSky.daily.data.slice(0, 7).findIndex(day => day.icon === 'Rain' || day.icon === 'Drizzle')
        const firstNoRainIndex = darkSky.daily.data.slice(0.7).findIndex(day => day.icon !== 'Rain' && day.icon !== 'Drizzle')
        if (firstRainIndex === 0) {
            // If every day has a rain icon, it should say "Rain throughout the week."
            if (firstNoRainIndex === -1) {
                darkSky.daily.summary = 'Rain throughout the week.'
            } else {
                const firstNoRainWeekday = weekday[new Date(darkSky.daily.data[firstNoRainIndex].time * 1000).getDay()]
                darkSky.daily.summary = `Rain until ${firstNoRainWeekday}.`
            }
        } else if (firstNoRainIndex === 0) {
            if (firstRainIndex === -1) {
                darkSky.daily.summary = 'No precipitation throughout the week.'
            } else {
                const firstRainWeekday = weekday[new Date(darkSky.daily.data[firstRainIndex].time * 1000).getDay()]
                darkSky.daily.summary = `Rain starting ${firstRainWeekday}.`
            }
        }
    }

    return darkSky
}

async function getForecast({ latitude: latitudeParam, longitude: longitudeParam }) {
    const { latitude, longitude } = normalizeCoordinates({ latitude: latitudeParam, longitude: longitudeParam })

    const cacheKey = safeKey(`weatherkit/${latitude},${longitude}`)
    // Check the cache
    const result = await cacheGet(cacheKey)
    if (result) {
        return result
    }

    const keyPath = process.env.APPLE_WEATHERKIT_KEY_PATH || `AuthKey_${process.env.APPLEKEYID}.p8`
    const key = fs.readFileSync(keyPath, 'utf8')
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
        console.log('Cannot get location available datasets')
    }
    return emptyWeatherResponse
}

export { getForecast }
