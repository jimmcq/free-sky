import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

function HourWeather({ minutely }) {
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
            return `${hour % 12 || 12}:${date.getMinutes()}${hour >= 12 ? 'pm' : 'am'}`
          },
          label: function (context) {
            const index = context.dataIndex
            return `${minuteData[index].precipIntensity.toFixed(2)} in. ${minuteData[index].precipType}`
          },
        },
      },
    },
  }

  const labels = minuteData.map(minuteData => {
    const date = new Date(minuteData.time * 1000)
    return date.getMinutes()
  })

  const dataset = minuteData.map(minuteData => {
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
  minutely_summary: {
    fontSize: 22,
    fontWeight: 300,
  },
})

export default HourWeather
