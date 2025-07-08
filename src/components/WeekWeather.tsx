import * as React from 'react'
import DayDetail from './DayDetail'
import type { WeatherInfo } from '../lib/types'
import styles from './WeekWeather.module.css'

function WeekWeather({ daily }: { daily: WeatherInfo }) {
    const { summary: dailySummary } = daily

    const dailyDetails = daily.data.map((dayDetail, index) => {
        return <DayDetail key={index} day={dayDetail} index={index} />
    })

    return (
        <div className={styles.container}>
            <p className={styles.dailySummary}>{dailySummary}</p>
            {dailyDetails}
        </div>
    )
}

export default WeekWeather
