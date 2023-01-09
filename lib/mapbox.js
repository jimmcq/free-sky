async function getPlaceName({ latitude, longitude }) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  const apiResponse = await fetch(url)
  const placeData = await apiResponse.json()
  return placeData.features[0]?.place_name
}

async function searchPlace(place) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  const apiResponse = await fetch(url)
  const placeData = await apiResponse.json()
  return placeData.features
}

module.exports = { getPlaceName, searchPlace }
