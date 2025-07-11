import * as React from 'react'
import { bearingToCardinal, normalizeIconWithDayNight, normalizeSummary } from '../lib/helpers'
import ColorSkycons, { ColorSkyconsType } from 'react-color-skycons'
import type { WeatherData, WeatherInfo } from '../lib/types'
import styles from './CurrentWeather.module.css'

interface CurrentWeatherProps {
    placeName: string
    currently: WeatherData
    hourly: WeatherInfo
    daily: WeatherInfo
    timezone: string
}

function CurrentWeather({ placeName, currently, hourly, daily, timezone }: CurrentWeatherProps) {
    const { temperature, summary: currentSummary, apparentTemperature, icon, windSpeed, windBearing, time } = currently
    const today = daily.data[0]
    const { temperatureLow, temperatureHigh, sunrise, sunset } = today

    const nameParts = placeName.split(',')
    const location = nameParts.length <= 2 ? placeName : `${nameParts[0]}, ${nameParts[1]}`

    const temperatureDirection = hourly.data[0].temperature < hourly.data[1].temperature ? '\u2191' : '\u2193'
    const iconType = ColorSkyconsType[normalizeIconWithDayNight(icon, time, timezone, sunrise, sunset)]

    return (
        <div className={styles.container}>
            <p className={styles.text}>Weather for {location}</p>
            <div className={styles.rowContainer}>
                <ColorSkycons className={styles.icon} type={iconType} animate={true} size={80} resizeClear={true} />
                <div className={styles.weatherInfo}>
                    <div className={styles.summary}>
                        {Math.round(temperature)}°<span className={styles.temperatureArrow}>{temperatureDirection}</span>{' '}
                        {normalizeSummary(currentSummary)}.
                    </div>
                    <div className={styles.detailsText}>
                        <span className={styles.label}>Feels like: </span>
                        <span className={styles.temperature}>{Math.round(apparentTemperature)}°</span>{' '}
                        <span className={styles.label}>Low: </span>
                        <span className={styles.temperature}>{Math.round(temperatureLow)}°</span>{' '}
                        <span className={styles.label}>High: </span>
                        <span className={styles.temperature}>{Math.round(temperatureHigh)}°</span>
                    </div>
                    <div className={styles.detailsText}>
                        <span className={styles.label}>Wind: </span>
                        <span className={styles.temperature}>
                            {Math.round(windSpeed)} mph ({bearingToCardinal(windBearing)})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrentWeather
