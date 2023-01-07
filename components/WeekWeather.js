import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function WeekWeather({ daily }) {
  const { summary: dailySummary } = daily
  return (
    <View style={styles.container}>
      <Text style={styles.daily_summary}>7 days: {dailySummary}</Text>
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
  daily_summary: {
    fontSize: 22,
    fontWeight: 300,
  },
})

export default WeekWeather
