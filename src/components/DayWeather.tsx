import * as React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, TimeScale, ChartOptions, ChartData } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import type { WeatherInfo } from '../lib/types'
import { normalizeSummary } from '../lib/helpers'
import styles from './DayWeather.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, TimeScale)

function DayWeather({ hourly }: { hourly: WeatherInfo }) {
    const { summary: hourlySummary, data: hourData } = hourly
    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: function (context) {
                        const index = context[0].dataIndex
                        const date = new Date(hourData[index].time * 1000)
                        const hour = date.getHours()
                        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                        return `${hour % 12 || 12}${hour >= 12 ? 'pm' : 'am'} ${weekday[date.getDay()]}`
                    },
                    label: function (context) {
                        const index = context.dataIndex
                        const { summary, temperature } = hourData[index]
                        return `${normalizeSummary(summary)} ${Math.round(temperature)}°`
                    },
                    footer: function (context) {
                        const index = context[0].dataIndex
                        const { precipProbability, precipIntensity, precipType } = hourData[index]
                        if (precipProbability > 0 || precipIntensity > 0) {
                            return `${precipType ? precipType.charAt(0).toUpperCase() + precipType.slice(1) : 'Rain'} ${Math.round(
                                precipProbability * 100
                            )}% ${(precipIntensity * 24).toFixed(2)} in.`
                        }
                    },
                },
            },
        },
        scales: {
            y: {
                display: false,
            },
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        hour: 'haaa',
                        day: 'E',
                    },
                },
                ticks: {
                    major: {
                        enabled: true,
                    },
                },
                grid: {
                    display: true,
                    drawOnChartArea: false,
                    z: 1,
                },
            },
        },
    }

    let displayChart = false

    const labels = hourData.map(hourData => {
        return new Date(hourData.time * 1000)
    })

    const dataset = Array(hourData.length).fill(1)

    const backgroundColor = hourData.map(hourData => {
        if (hourData.icon.split('-')[0] !== 'clear') {
            displayChart = true
        }

        switch (hourData.summary.replace(/\s+/g, '')) {
            case 'Drizzle':
            case 'PossibleDrizzle':
                return '#8caeda'
            case 'LightRain':
            case 'PossibleLightRain':
                return '#80a5d6'
            case 'Rain':
                return '#4a80c7'
            case 'Heavy Rain':
            case 'Thunderstorms':
                return '#305f9c'
            case 'PartlyCloudy':
            case 'MostlyClear':
                return '#d5dae2'
            case 'Cloudy':
                return '#b6bfcb'
            case 'MostlyCloudy':
                return '#9fabba'
            case 'Overcast':
                return '#878f9a'
            case 'LightSnow':
            case 'PossibleLightSnow':
                return '#a39ad7'
            case 'HeavySnow':
                return '#7569c4'
        }

        switch (hourData.icon.split('-')[0].toLocaleLowerCase()) {
            case 'clear':
                return '#eeeef5'
            case 'rain':
                return '#4a80c7'
            case 'light':
                return '#80a5d6'
            case 'snow':
                return '#8c82ce'
            case 'sleet':
                return '#eeeef5'
            case 'wind':
                return '#eeeef5'
            case 'fog':
                return '#eeeef5'
            case 'partly':
                return '#d5dae2'
            case 'cloudy':
                return '#b6bfcb'
            case 'mostly':
                return '#9fabba'
            case 'overcast':
                return '#878f9a'
            default:
                return '#eeeef5'
        }
    })

    const datasets = [{ barPercentage: 1.25, data: dataset, backgroundColor }]
    const data: ChartData<'bar'> = { labels, datasets }

    if (hourlySummary === 'Clear throughout the day.') {
        displayChart = false
    }

    return (
        <div className={styles.container}>
            <p className={styles.hourlySummary}>{hourlySummary}</p>
            {displayChart && (
                <div className={styles.chartContainer}>
                    <Bar options={options} data={data} height={100} />
                </div>
            )}
        </div>
    )
}

export default DayWeather
