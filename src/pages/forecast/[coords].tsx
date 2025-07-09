import React, { useEffect } from 'react'
import Alerts from '../../components/Alerts'
import CurrentWeather from '../../components/CurrentWeather'
import DayWeather from '../../components/DayWeather'
import HourWeather from '../../components/HourWeather'
import WeekWeather from '../../components/WeekWeather'
import { getForecast } from '../../lib/weatherkit'
import { getPlaceName } from '../../lib/mapbox'
import { WebStorage } from '../../lib/storage'
import { useRouter } from 'next/router'
import { setCacheControl } from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'
import type { NextApiResponse } from 'next'
import { emptyWeatherResponse, Place, WeatherResponse } from '../../lib/types'
import styles from './coords.module.css'

export async function getServerSideProps({ res, query }: { res: NextApiResponse; query: { coords: string } }) {
    setCacheControl({ res, maxAge: 180 })
    const parts = query.coords.split(',')
    const { latitude, longitude } = normalizeCoordinates({ latitude: parts[0], longitude: parts[1] })

    let forecast: WeatherResponse = emptyWeatherResponse

    try {
        forecast = await getForecast({ latitude, longitude })
    } catch (_e) {
        throw new Error('Error retrieving forecast data')
    }

    if (forecast?.latitude === undefined || forecast?.longitude === undefined) {
        throw new Error('Invalid forecast data')
    }

    const placeName = (await getPlaceName({ latitude: latitude, longitude: longitude })) || `${latitude},${longitude}`

    const pageMetadata = { title: `Weather for ${placeName}` }
    const props = { forecast, placeName, latitude, longitude, pageMetadata }

    return { props }
}

function ForecastPage({
    forecast,
    placeName,
    latitude,
    longitude,
}: {
    forecast: WeatherResponse
    placeName: string
    latitude: string
    longitude: string
}) {
    const router = useRouter()

    // Refresh server side props every 10 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            try {
                router.replace(router.asPath)
            } catch (_e) {
                // Do nothing
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    const { currently, minutely, hourly, daily, alerts, timezone } = forecast

    useEffect(() => {
        ;(async () => {
            const storedLocationList = (await WebStorage.getItem('locationList')) || '[]'

            const newList = JSON.parse(storedLocationList)

            let found = false
            newList.forEach((item: Place) => {
                if (item.placeName === placeName) {
                    found = true
                }
            })

            if (!found) {
                newList.unshift({ placeName, latitude, longitude })
                WebStorage.setItem('locationList', JSON.stringify(newList.slice(0, 5)))
            }
        })()
    }, [])

    return (
        <div className={styles.container}>
            <div>
                <CurrentWeather placeName={placeName} currently={currently} hourly={hourly} daily={daily} />
            </div>
            <div>
                <Alerts alerts={alerts} />
            </div>
            <div>
                <HourWeather minutely={minutely} hourly={hourly} timezone={timezone} />
            </div>
            <div>
                <DayWeather hourly={hourly} timezone={timezone} />
            </div>
            <div>
                <WeekWeather daily={daily} />
            </div>
        </div>
    )
}

export default ForecastPage
