import { NextApiRequest, NextApiResponse } from 'next'
import { setCacheControl } from '../../lib/cache-control'
import { searchPlace } from '../../lib/mapbox'
import { MapBoxPlace } from '../../lib/types'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    setCacheControl({ res, maxAge: 86400 })

    const { place } = req.query as { place: string }
    if (!place) {
        return res.status(400).send('Error')
    }

    let features: MapBoxPlace[] = []

    if (req.method === 'GET' && place) {
        try {
            features = await searchPlace(place)
        } catch (e) {
            return res.status(500).send('Error')
        }

        if (!features) {
            return res.status(500).send('Error')
        }

        if (features?.length) {
            const result = features.map(place => {
                return { place_name: place.place_name, center: place.center }
            })
            return res.status(200).json(result)
        } else {
            return res.status(200).json([])
        }
    } else {
        return res.status(404).json([])
    }
}

export default handler
