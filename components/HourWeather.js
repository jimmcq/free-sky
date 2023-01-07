import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function HourWeather({ minutely }) {
  const { summary: minutelySummary } = minutely
  return (
    <View style={styles.container}>
      <Text style={styles.minutely_summary}>Next hour: {minutelySummary}</Text>
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
  minutely_summary: {
    fontSize: 22,
    fontWeight: 300,
  },
})

export default HourWeather
