import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function DayWeather({ hourly }) {
  const { summary: hourlySummary } = hourly
  return (
    <View style={styles.container}>
      <Text style={styles.hourly_summary}>Next 24 hours: {hourlySummary}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  hourly_summary: {
    fontSize: 22,
    fontWeight: 300,
  },
})

export default DayWeather
