import { NextApiRequest, NextApiResponse } from 'next'
import { setCacheControl } from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'
import { getPlaceName } from '../../lib/mapbox'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    setCacheControl({ res, maxAge: 86400 })

    const queryLat = req.query.latitude?.toString() || ''
    const queryLon = req.query.longitude?.toString() || ''

    let latitude = ''
    let longitude = ''
    try {
        ;({ latitude, longitude } = normalizeCoordinates({ latitude: queryLat.replace(/"/, ''), longitude: queryLon.replace(/"/, '') }))
    } catch (e) {
        return res.status(500).send('Invalid location coordinates')
    }

    if (req.method === 'GET') {
        const placeData = await getPlaceName({ latitude, longitude })
        res.status(200).json(placeData || '')
    } else {
        res.status(404).send('')
    }
}

export default handler
