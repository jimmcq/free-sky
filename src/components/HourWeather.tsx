import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  TimeScale,
  ChartOptions,
  ChartData,
  TooltipItem,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import type { WeatherInfo } from '../lib/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, TimeScale)

function HourWeather({ minutely, hourly }: { minutely: WeatherInfo; hourly: WeatherInfo }) {
  if (!minutely) {
    return null
  }
  const { summary: minutelySummary, data: minuteData } = minutely

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (context: Array<TooltipItem<'bar'>>): string {
            const index = context[0].dataIndex
            const date = new Date(minuteData[index].time * 1000)
            const hour = date.getHours()
            const minute = date.getMinutes().toString()
            return `${hour % 12 || 12}:${minute.padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`
          },
          label: function (context: TooltipItem<'bar'>): string {
            const index = context.dataIndex
            const { precipIntensity, precipType } = minuteData[index]
            const decimal = precipIntensity >= 0.01 ? 2 : 3
            return `${precipIntensity.toFixed(decimal)} in. ${precipType}`
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'h:mm',
            hour: 'h:mm',
          },
        },
        ticks: {
          major: {
            enabled: true,
          },
        },
      },
    },
  }

  let displayChart = false

  const labels = minuteData.map(minuteData => {
    return new Date(minuteData.time * 1000)
  })

  const dataset = minuteData.map(minuteData => {
    if (minuteData.precipIntensity > 0) {
      displayChart = true
    }
    return minuteData.precipIntensity
  })

  const backgroundColor = minuteData.map(minuteData => {
    if (minuteData.precipType.toLowerCase() === 'snow') {
      return minuteData.precipIntensity > 0.05 ? '#8c82ce' : '#a39ad7'
    }
    return minuteData.precipIntensity > 0.05 ? '#4a80c7' : '#80a5d6'
  })

  const datasets = [{ barPercentage: 1.25, data: dataset, backgroundColor }]
  const data: ChartData<'bar'> = { labels, datasets }

  let displaySummary = true
  if (minutelySummary === 'Clear for the hour.') {
    displayChart = false
    if (hourly.summary === 'Clear throughout the day.') {
      displaySummary = false
    }
  }

  if (!displaySummary && !displayChart) {
    return null
  }

  return (
    <View style={styles.container}>
      {displaySummary && <Text style={styles.minutely_summary}>{minutelySummary}</Text>}
      {displayChart && (
        <View style={styles.chart_container}>
          <Bar data={data} options={options} height={100} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '16px',
  },
  chart_container: { height: '100px', width: '100%' },
  minutely_summary: {
    fontSize: 22,
    fontWeight: '300',
    maxWidth: '361px',
  },
})

export default HourWeather
