import { NextApiRequest, NextApiResponse } from 'next'
import { setCacheControl } from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'
import { getPlaceName } from '../../lib/mapbox'

// Input validation function
function validateCoordinates(latitude: string, longitude: string): { isValid: boolean; error?: string } {
    // Check if parameters are provided
    if (!latitude || !longitude) {
        return { isValid: false, error: 'Both latitude and longitude parameters are required' }
    }

    // Remove any quotes and clean the input
    const cleanLat = latitude.replace(/["']/g, '').trim()
    const cleanLon = longitude.replace(/["']/g, '').trim()

    // Check if they're valid numbers
    const latNum = parseFloat(cleanLat)
    const lonNum = parseFloat(cleanLon)

    if (isNaN(latNum) || isNaN(lonNum)) {
        return { isValid: false, error: 'Latitude and longitude must be valid numbers' }
    }

    // Check if latitude is within valid range (-90 to 90)
    if (latNum < -90 || latNum > 90) {
        return { isValid: false, error: 'Latitude must be between -90 and 90' }
    }

    // Check if longitude is within valid range (-180 to 180)
    if (lonNum < -180 || lonNum > 180) {
        return { isValid: false, error: 'Longitude must be between -180 and 180' }
    }

    return { isValid: true }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    setCacheControl({ res, maxAge: 86400 })

    const queryLat = req.query.latitude?.toString() || ''
    const queryLon = req.query.longitude?.toString() || ''

    // Validate input parameters
    const validation = validateCoordinates(queryLat, queryLon)
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.error })
    }

    let latitude = ''
    let longitude = ''
    try {
        ;({ latitude, longitude } = normalizeCoordinates({
            latitude: queryLat.replace(/["']/g, '').trim(),
            longitude: queryLon.replace(/["']/g, '').trim(),
        }))
    } catch (_e) {
        return res.status(400).json({ error: 'Invalid location coordinates' })
    }

    try {
        const placeData = await getPlaceName({ latitude, longitude })
        res.status(200).json(placeData || '')
    } catch (_e) {
        // Error getting place name
        return res.status(500).json({ error: 'Unable to retrieve place name for the specified coordinates' })
    }
}

export default handler
