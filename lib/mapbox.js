import { cacheGet, cacheSet, safeKey } from './cache'

async function getPlaceName({ latitude, longitude }) {
  const sanitizedLatitude = parseFloat(latitude).toFixed(4)
  const sanitizedLongitude = parseFloat(longitude).toFixed(4)

  if (
    isNaN(sanitizedLatitude) ||
    isNaN(sanitizedLongitude) ||
    sanitizedLatitude < -90 ||
    sanitizedLatitude > 90 ||
    sanitizedLongitude < -180 ||
    sanitizedLongitude > 180
  ) {
    throw new Error('Invalid location coordinates')
  }

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

async function searchPlace(place) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
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
  result = placeData.features

  // Store the result in the cache for two days
  cacheSet({ key: cacheKey, value: result, expire: 172800 })

  return result
}

module.exports = { getPlaceName, searchPlace }
