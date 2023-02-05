import { cacheGet, cacheSet, safeKey } from './cache'
import { normalizeCoordinates } from './helpers'
import { emptyWeatherResponse, WeatherResponse } from './types'

async function getForecast({ latitude: latitudeParam, longitude: longitudeParam }: { latitude: string; longitude: string }) {
  const { latitude, longitude } = normalizeCoordinates({ latitude: latitudeParam, longitude: longitudeParam })

  const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_SECRET_KEY}/${latitude},${longitude}`
  const cacheKey = safeKey(url)
  let result: WeatherResponse = emptyWeatherResponse

  // Check the cache
  result = await cacheGet(cacheKey)
  if (result) {
    return result
  }

  // Fetch Data
  const apiResponse = await fetch(url, {
    method: 'GET',
  })
  result = (await apiResponse.json()) || {}

  // Store the result in the cache for one minute
  cacheSet({ key: cacheKey, value: result, expire: 60 })

  return result
}

export { getForecast }
