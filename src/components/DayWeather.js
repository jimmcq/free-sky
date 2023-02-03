import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, TimeScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

ChartJS.register(CategoryScale, LinearScale, BarElement, TimeScale)

function DayWeather({ hourly }) {
  const { summary: hourlySummary, data: hourData } = hourly
  const options = {
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
            return `${summary} ${Math.round(temperature)}°`
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

    switch (hourData.summary) {
      case 'Drizzle':
      case 'Possible Drizzle':
        return '#8caeda'
      case 'Light Rain':
      case 'Possible Light Rain':
        return '#80a5d6'
      case 'Heavy Rain':
        return '#305f9c'
      case 'Mostly Cloudy':
        return '#9fabba'
      case 'Overcast':
        return '#878f9a'
      case 'Light Snow':
      case 'Possible Light Snow':
        return '#a39ad7'
      case 'Heavy Snow':
        return '#7569c4'
    }

    switch (hourData.icon.split('-')[0]) {
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

  const data = { labels }
  data.datasets = [{ barPercentage: 1.25, data: dataset, backgroundColor }]

  if (hourlySummary === 'Clear throughout the day.') {
    displayChart = false
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hourly_summary}>{hourlySummary}</Text>
      {displayChart === true && (
        <View style={styles.chart_container}>
          <Bar options={options} data={data} height={100} />
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
  hourly_summary: {
    fontSize: 22,
    fontWeight: 300,
    maxWidth: '361px',
  },
})

export default DayWeather
