import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

function DayDetail({ day, index }) {
  const { icon, time, temperatureLow, temperatureHigh, summary } = day
  return (
    <View style={styles.row_container}>
      <Image
        title={summary}
        style={styles.small_icon}
        source={{ uri: `https://darksky.net/images/weather-icons/${icon}.png` }}
        alt={icon}
      />
      <Text style={[styles.text, styles.text50]}>
        {index === 0 ? 'Today' : new Date(time * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={[styles.text, styles.text70]}>
        {' '}
        {Math.round(temperatureLow)}˚-{Math.round(temperatureHigh)}˚
      </Text>
      <Text style={[styles.text, styles.text250]}>{summary}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  small_icon: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '40px',
    width: 40,
    height: 40,
    marginRight: '8px',
  },
  text: {
    fontSize: '16px',
    fontWeight: 400,
  },
  text50: {
    width: '50px',
  },
  text70: {
    width: '70px',
  },
  text250: {
    width: '250px',
  },
})

export default DayDetail
