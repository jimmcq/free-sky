import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

function HourWeather({ minutely }) {
  if (!minutely) {
    return null
  }
  const { summary: minutelySummary, data: minuteData } = minutely

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex
            const date = new Date(minuteData[index].time * 1000)
            const hour = date.getHours()
            const minute = date.getMinutes().toString()
            return `${hour % 12 || 12}:${minute.padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`
          },
          label: function (context) {
            const index = context.dataIndex
            const decimal = minuteData[index].precipIntensity >= 0.01 ? 2 : 3
            return `${minuteData[index].precipIntensity.toFixed(decimal)} in. ${minuteData[index].precipType}`
          },
        },
      },
    },
  }

  let displayChart = false

  const labels = minuteData.map(minuteData => {
    const date = new Date(minuteData.time * 1000)
    return date.getMinutes()
  })

  const dataset = minuteData.map(minuteData => {
    if (minuteData.precipIntensity > 0) {
      displayChart = true
    }
    return minuteData.precipIntensity
  })

  const backgroundColor = minuteData.map(minuteData => {
    return minuteData.precipIntensity >= 0.02 ? '#4a80c7' : '#80a5d6'
  })

  const data = { labels }
  data.datasets = [{ barPercentage: 1.25, data: dataset, backgroundColor }]

  return (
    <View style={styles.container}>
      <Text style={styles.minutely_summary}>{minutelySummary}</Text>
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
  minutely_summary: {
    fontSize: 22,
    fontWeight: 300,
  },
})

export default HourWeather
