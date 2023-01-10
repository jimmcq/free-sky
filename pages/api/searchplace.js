import { searchPlace } from '../../lib/mapbox'

async function handler(req, res) {
  const { place } = req.query

  if (req.method === 'GET' && place) {
    const features = await searchPlace(place)
    if (features.length) {
      const result = features.map(place => {
        return { place_name: place.place_name, center: place.center }
      })
      res.status(200).send(result)
    } else {
      res.status(200).send([])
    }
  } else {
    res.status(404).send([])
  }
}

export default handler
