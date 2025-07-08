import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { setCacheControl } from '../lib/cache-control'
import { normalizeCoordinates } from '../lib/helpers'
import { requestLocationPermission, getCurrentPosition } from '../lib/location'
import { WebStorage } from '../lib/storage'
import type { NextApiResponse } from 'next'
import type { MapBoxPlace, Place } from '../lib/types'
import styles from './index.module.css'

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
    setCacheControl({ res, maxAge: 3600 })
    return { props: {} }
}

function IndexPage() {
    const [linkList, setLinkList] = useState<JSX.Element[]>([])

    const debounced = useDebouncedCallback(value => {
        if (value.length >= 3) {
            search(value)
        }
    }, 1000)

    useEffect(() => {
        ;(async () => {
            // Get from Storage
            let storedLocationList
            try {
                storedLocationList = await WebStorage.getItem('locationList')
            } catch (error) {
                console.error('Error retrieving location list:', error)
                storedLocationList = null
            }
            if (storedLocationList) {
                const newList = JSON.parse(storedLocationList)
                setLinkList(
                    newList.map((place: Place, index: number) => {
                        const { latitude, longitude } = normalizeCoordinates({ latitude: place.latitude, longitude: place.longitude })

                        return (
                            <Link key={index} href={`/forecast/${latitude},${longitude}`} className={styles.link}>
                                {place.placeName}
                            </Link>
                        )
                    })
                )
            } else {
                // Get Location
                const permission = await requestLocationPermission()
                if (permission !== 'granted') {
                    return
                }

                const location = await getCurrentPosition()

                let latitude, longitude
                try {
                    ;({ latitude, longitude } = normalizeCoordinates({
                        latitude: location.coords.latitude.toString(),
                        longitude: location.coords.longitude.toString(),
                    }))
                } catch (error) {
                    return
                }

                const url = `/api/getplacename?latitude=${latitude}&longitude=${longitude}`
                const response = await fetch(url)
                const placeName = await response.json()

                setLinkList([
                    <Link key={0} href={`/forecast/${latitude},${longitude}`} className={styles.link}>
                        {placeName}
                    </Link>,
                ])
            }
        })()
    }, [])

    async function search(text: string) {
        if (!text) {
            return null
        }
        const url = `/api/searchplace?place=${text}`
        const response = await fetch(url)
        const features = await response.json()

        if (features.length) {
            setLinkList(
                features.map((place: MapBoxPlace, index: number) => {
                    const { latitude, longitude } = normalizeCoordinates({
                        latitude: place.center[1].toString(),
                        longitude: place.center[0].toString(),
                    })

                    return (
                        <Link key={index} href={`/forecast/${latitude},${longitude}`} className={styles.link}>
                            {place.place_name}
                        </Link>
                    )
                })
            )
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.text}>When Dark Sky is gone, Free-Sky.Net remains</h1>
            <input className={styles.input} placeholder="Location Search" onChange={e => debounced(e.target.value)} />
            <p className={styles.instructionText}>Enter an address above</p>
            {linkList.length > 0 && <p className={styles.instructionText}>or select an address below</p>}
            <div className={styles.results}>{linkList}</div>
        </div>
    )
}

export default IndexPage
