import setCacheControl from '../../lib/cache-control'
import { getPlaceName } from '../../lib/mapbox'

async function handler(req, res) {
  setCacheControl({ res, maxAge: 86400 })

  const { latitude: queryLat, longitude: queryLon } = req.query
  const latitude = parseFloat(queryLat.replace(/"/, '')).toFixed(4)
  const longitude = parseFloat(queryLon.replace(/"/, '')).toFixed(4)

  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    res.status(500).send('Invalid location coordinates')
  }

  if (req.method === 'GET') {
    const placeData = await getPlaceName({ latitude, longitude })
    res.status(200).json(placeData || '')
  } else {
    res.status(404).send('')
  }
}

export default handler
