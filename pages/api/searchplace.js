import { searchPlace } from '../../lib/mapbox'

async function handler(req, res) {
  const { place } = req.query
  if (!place) {
    res.status(400).send('Error')
  }

  let features = []
  if (req.method === 'GET' && place) {
    try {
      features = await searchPlace(place)
    } catch (e) {
      res.status(500).send('Error')
    }

    if (!features) {
      res.status(500).send('Error')
    }

    if (features?.length) {
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
