import * as fs from 'fs'
import WeatherKit, { isErr } from 'node-apple-weatherkit'
import { cacheGet, cacheSet, safeKey } from './cache'
import { celciusToFahrenheit, kilometersToMiles, millimetersToInches, normalizeCoordinates } from './helpers'
import { emptyData, emptyWeatherResponse } from './types'

function translateToDarkSky(weatherkit) {
  const darkSky = emptyWeatherResponse

  darkSky.latitude = weatherkit.currentWeather?.metadata.latitude || 0
  darkSky.longitude = weatherkit.currentWeather?.metadata.longitude || 0

  darkSky.currently.time = Date.parse(weatherkit.currentWeather?.metadata.readTime || '') / 1000
  darkSky.currently.icon = weatherkit.currentWeather?.conditionCode || ''
  darkSky.currently.summary = weatherkit.currentWeather?.conditionCode || ''
  darkSky.currently.precipIntensity = millimetersToInches(weatherkit.currentWeather?.precipitationIntensity || 0)
  darkSky.currently.temperature = celciusToFahrenheit(weatherkit.currentWeather?.temperature || 0)
  darkSky.currently.apparentTemperature = celciusToFahrenheit(weatherkit.currentWeather?.temperatureApparent || 0)
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
          summary: hour.conditionCode || '',
          precipIntensity: millimetersToInches(hour.precipitationIntensity || 0),
          precipProbability: hour.precipitationChance || 0,
          temperature: celciusToFahrenheit(hour.temperature || 0),
        }
      }) || []

  darkSky.daily.data =
    weatherkit.forecastDaily?.days
      .filter(day => Date.parse(day.forecastStart) >= new Date().setUTCHours(0))
      .map(day => {
        let summary = `${day.conditionCode} throughout the day.`
        if (day.daytimeForecast.conditionCode !== day.overnightForecast.conditionCode) {
          summary = `${day.daytimeForecast.conditionCode}, then ${day.overnightForecast.conditionCode} overnight.`
        }
        return {
          ...emptyData,
          time: Date.parse(day.forecastStart || '') / 1000,
          icon: day.conditionCode || '',
          summary,
          precipIntensity: millimetersToInches(day.precipitationAmount || 0),
          precipProbability: day.precipitationChance || 0,
          temperatureLow: celciusToFahrenheit(day.temperatureMin || 0),
          temperatureHigh: celciusToFahrenheit(day.temperatureMax || 0),
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

  const key = fs.readFileSync(`AuthKey_${process.env.APPLEKEYID}.p8`, 'utf8')
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
