import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

function HourWeather({ minutely }) {
  const labels = minutely.data.map(minuteData => {
    const date = new Date(minuteData.time * 1000)
    return date.getMinutes()
  })

  const dataset = minutely.data.map(minuteData => {
    return minuteData.precipIntensity
  })
  const { summary: minutelySummary } = minutely
  const data = { labels }
  data.datasets = [{ data: dataset, backgroundColor: 'rgba(53, 162, 235, 0.5)' }]
  console.log(data)

  return (
    <View style={styles.container}>
      <Text style={styles.minutely_summary}>60 minutes: {minutelySummary}</Text>
      <View style={styles.chart_container}>
        <Bar options={options} data={data} />
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
