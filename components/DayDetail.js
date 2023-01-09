import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

function DayDetail({ day, index }) {
  const { icon, time, temperatureLow, temperatureHigh, precipType, precipProbability, precipIntensity } = day
  return (
    <View style={styles.row_container}>
      <Image style={styles.small_icon} source={{ uri: `https://darksky.net/images/weather-icons/${icon}.png` }} alt={icon} />
      <Text style={[styles.text, styles.text75]}>
        {index === 0 ? 'Today' : new Date(time * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={[styles.text, styles.text75]}>
        {' '}
        {Math.round(temperatureLow)}˚-{Math.round(temperatureHigh)}˚
      </Text>
      <Text style={[styles.text, styles.text150]}>
        {' '}
        {precipProbability > 0 || precipIntensity > 0 ? (
          <>
            {precipType ? precipType.charAt(0).toUpperCase() + precipType.slice(1) : 'Rain'} {Math.round(precipProbability * 100)}%{' '}
            {(precipIntensity * 24).toFixed(2)} in.
          </>
        ) : (
          'No precipitation.'
        )}
      </Text>
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
  text75: {
    width: '75px',
  },
  text150: {
    width: '150px',
  },
})

export default DayDetail
