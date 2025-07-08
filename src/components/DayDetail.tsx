import * as React from 'react'
import ColorSkycons, { ColorSkyconsType } from 'react-color-skycons'
import { normalizeIcon, normalizeSummary } from '../lib/helpers'
import type { WeatherData } from '../lib/types'
import styles from './DayDetail.module.css'

function DayDetail({ day, index }: { day: WeatherData; index: number }) {
    const { icon, time, temperatureLow, temperatureHigh, summary } = day
    const iconType = ColorSkyconsType[normalizeIcon(icon)]

    return (
        <div className={styles.rowContainer}>
            <ColorSkycons className={styles.smallIcon} type={iconType} animate={true} size={40} resizeClear={true} />
            <span className={`${styles.text} ${styles.text50}`}>
                {index === 0 ? 'Today' : new Date(time * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className={`${styles.text} ${styles.text70}`}>
                {' '}
                {Math.round(temperatureLow)}°-{Math.round(temperatureHigh)}°
            </span>
            <span className={`${styles.text} ${styles.text200}`}>{normalizeSummary(summary)}</span>
        </div>
    )
}

export default DayDetail
