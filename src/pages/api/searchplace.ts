import { NextApiRequest, NextApiResponse } from 'next'
import { setCacheControl } from '../../lib/cache-control'
import { searchPlace } from '../../lib/mapbox'
import { MapBoxPlace } from '../../lib/types'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    setCacheControl({ res, maxAge: 86400 })

    const { place } = req.query as { place: string }

    // Validate place parameter
    if (!place) {
        return res.status(400).json({ error: 'Place parameter is required' })
    }

    // Validate place is a string and not empty after trimming
    if (typeof place !== 'string' || place.trim().length === 0) {
        return res.status(400).json({ error: 'Place parameter must be a non-empty string' })
    }

    // Check for reasonable length limits (prevent abuse)
    if (place.length > 200) {
        return res.status(400).json({ error: 'Place parameter must be less than 200 characters' })
    }

    let features: MapBoxPlace[] = []

    try {
        features = await searchPlace(place.trim())
    } catch (_e) {
        // Error searching for places
        return res.status(500).json({ error: 'Unable to search for places at this time' })
    }

    if (!features) {
        return res.status(500).json({ error: 'Invalid response from location service' })
    }

    if (features?.length) {
        const result = features.map(place => {
            return { place_name: place.place_name, center: place.center }
        })
        return res.status(200).json(result)
    } else {
        return res.status(200).json([])
    }
}

export default handler
