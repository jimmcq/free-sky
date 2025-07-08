import Link from 'next/link'
import * as React from 'react'
import type { WeatherAlert } from '../lib/types'
import styles from './Alerts.module.css'

function Alerts({ alerts }: { alerts: WeatherAlert[] }) {
    if (!alerts?.length) {
        return null
    }

    const alertLinks = alerts.map((alert, index) => {
        return (
            <Link key={index} href={alert.uri} className={styles.linkButton}>
                🚩 {alert.title}
            </Link>
        )
    })

    return <div className={styles.rowContainer}>{alertLinks}</div>
}

export default Alerts
