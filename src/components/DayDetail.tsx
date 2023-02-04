import * as React from 'react'
import ColorSkycons, { ColorSkyconsType } from 'react-color-skycons'
import { StyleSheet, Text, View } from 'react-native'
import type { WeatherData } from '../lib/types'

function DayDetail({ day, index }: { day: WeatherData; index: number }) {
  const { icon, time, temperatureLow, temperatureHigh, summary } = day
  const iconType = ColorSkyconsType[icon.replace(/-/g, '_').toUpperCase() as keyof typeof ColorSkyconsType]

  return (
    <View style={styles.row_container}>
      <ColorSkycons style={styles.small_icon} type={iconType} animate={true} size={40} resizeClear={true} />
      <Text style={[styles.text, styles.text50]}>
        {index === 0 ? 'Today' : new Date(time * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={[styles.text, styles.text70]}>
        {' '}
        {Math.round(temperatureLow)}°-{Math.round(temperatureHigh)}°
      </Text>
      <Text style={[styles.text, styles.text200]}>{summary}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '361px',
    marginTop: '8px',
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
    fontSize: 16,
    fontWeight: '400',
  },
  text50: {
    width: '50px',
  },
  text70: {
    width: '70px',
  },
  text200: {
    width: '200px',
  },
})

export default DayDetail
