import React from 'react'
import ColorSkycons from 'react-color-skycons'
import { StyleSheet, Text, View } from 'react-native'

function DayDetail({ day, index }) {
  const { icon, time, temperatureLow, temperatureHigh, summary } = day
  return (
    <View style={styles.row_container}>
      <ColorSkycons style={styles.small_icon} type={icon.toUpperCase().replaceAll('-', '_')} animate={true} size={40} resizeClear={true} />
      <Text style={[styles.text, styles.text50]}>
        {index === 0 ? 'Today' : new Date(time * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
      </Text>
      <Text style={[styles.text, styles.text70]}>
        {' '}
        {Math.round(temperatureLow)}˚-{Math.round(temperatureHigh)}˚
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
    fontSize: '16px',
    fontWeight: 400,
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
