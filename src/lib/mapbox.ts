import { cacheGet, cacheSet, safeKey } from './cache'
import { normalizeCoordinates } from './helpers'

async function getPlaceName({ latitude, longitude }: { latitude: string; longitude: string }) {
  const { latitude: sanitizedLatitude, longitude: sanitizedLongitude } = normalizeCoordinates({ latitude, longitude })

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${sanitizedLongitude},${sanitizedLatitude}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  const cacheKey = safeKey(url)
  let result = {}

  // Check the cache
  result = await cacheGet(cacheKey)
  if (result) {
    return result
  }

  // Fetch Data
  const apiResponse = await fetch(url, {
    method: 'GET',
  })
  const placeData = (await apiResponse.json()) || {}
  result = placeData.features[0]?.place_name

  // Store the result in the cache for two days
  cacheSet({ key: cacheKey, value: result, expire: 172800 })

  return result
}

async function searchPlace(place: string) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  const cacheKey = safeKey(url)
  let result = []

  // Check the cache
  result = await cacheGet(cacheKey)
  if (result) {
    return result
  }

  // Fetch Data
  const apiResponse = await fetch(url, {
    method: 'GET',
  })
  const placeData = (await apiResponse.json()) || {}
  result = placeData.features

  // Store the result in the cache for two days
  cacheSet({ key: cacheKey, value: result, expire: 172800 })

  return result
}

export { getPlaceName, searchPlace }
