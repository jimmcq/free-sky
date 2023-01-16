import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { translateIcon } from '../lib/helpers'

function CurrentWeather({ placeName, currently, daily }) {
  const { temperature, summary: currentSummary, apparentTemperature, icon } = currently
  const today = daily.data[0]
  const { temperatureLow, temperatureHigh } = today

  const nameParts = placeName.split(',')
  const location = nameParts.length <= 2 ? placeName : `${nameParts[0]}, ${nameParts[1]}`

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Current weather for {location}</Text>
      <View style={styles.row_container}>
        <Image style={styles.icon} source={`/icons/${translateIcon({ icon, summary: currentSummary })}.svg`} alt={icon} />

        <View>
          <Text style={styles.summary}>
            {Math.round(temperature)}˚ {currentSummary}.
          </Text>

          <Text style={styles.text}>
            <Text style={styles.label}>Feels like: </Text>
            <Text style={styles.temperature}>{Math.round(apparentTemperature)}˚</Text> <Text style={styles.label}>Low: </Text>
            <Text style={styles.temperature}>{Math.round(temperatureLow)}˚</Text> <Text style={styles.label}>High: </Text>
            <Text style={styles.temperature}>{Math.round(temperatureHigh)}˚</Text>
          </Text>
        </View>
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
  },
  row_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '368px',
  },
  text: {
    fontSize: 16,
  },
  summary: {
    fontSize: 32,
    fontWeight: 600,
  },
  icon: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '60px',
    width: 60,
    height: 60,
    marginRight: '8px',
  },
  hourly_summary: {
    fontSize: 28,
    fontWeight: 300,
  },
  label: {
    fontWeight: 400,
  },
  temperature: {
    fontWeight: 300,
  },
})

export default CurrentWeather
