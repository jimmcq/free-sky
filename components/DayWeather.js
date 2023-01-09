import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement)

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
            return hourData[index].summary
          },
        },
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const labels = hourData.map(hourData => {
    const date = new Date(hourData.time * 1000)
    const hour = date.getHours()
    return `${hour % 12 || 12}${hour >= 12 ? 'pm' : 'am'}`
  })

  const dataset = Array(hourData.length).fill(1)

  const backgroundColor = hourData.map(hourData => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.hourly_summary}>{hourlySummary}</Text>
      <View style={styles.chart_container}>
        <Bar options={options} data={data} height={100} />
      </View>
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
  },
})

export default DayWeather
