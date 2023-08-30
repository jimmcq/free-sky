import { NextApiRequest, NextApiResponse } from 'next'
import { setCacheControl } from '../../lib/cache-control'
import { searchPlace } from '../../lib/mapbox'
import { MapBoxPlace } from '../../lib/types'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    setCacheControl({ res, maxAge: 86400 })

    const { place } = req.query as { place: string }
    if (!place) {
        res.status(400).send('Error')
    }

    let features: MapBoxPlace[] = []

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
