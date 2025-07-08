import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { setCacheControl } from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'
import { requestLocationPermission, getCurrentPosition, LocationResult } from '../../lib/location'
import { NextApiResponse } from 'next'
import styles from './index.module.css'

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
    setCacheControl({ res, maxAge: 0 })
    return { props: {} }
}

function App() {
    const router = useRouter()
    const [location, setLocation] = useState<LocationResult>()
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        ;(async () => {
            const permission = await requestLocationPermission()
            if (permission !== 'granted') {
                setErrorMsg('Permission to access location was denied')
                return
            }

            const location = await getCurrentPosition()
            setLocation(location)
            const { latitude, longitude } = normalizeCoordinates({
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
            })

            router.push(`/forecast/${latitude},${longitude}`)
        })()
    }, [])

    let text = 'Waiting..'

    if (errorMsg) {
        text = errorMsg
    } else if (location) {
        const { latitude, longitude } = normalizeCoordinates({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
        })
        text = `Redirecting to /forecast/${latitude},${longitude}`
    }

    return (
        <div className={styles.container}>
            <p className={styles.paragraph}>{text}</p>
        </div>
    )
}

export default App
