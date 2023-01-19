import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { bearingToCardinal, translateIcon } from '../lib/helpers'

function CurrentWeather({ placeName, currently, hourly, daily }) {
  const { temperature, summary: currentSummary, apparentTemperature, icon, windSpeed, windBearing } = currently
  const today = daily.data[0]
  const { temperatureLow, temperatureHigh } = today

  const nameParts = placeName.split(',')
  const location = nameParts.length <= 2 ? placeName : `${nameParts[0]}, ${nameParts[1]}`

  const currentTime = Math.floor(Date.now() / 1000)
  const { sunriseTime, sunsetTime } = today

  const temperatureDirection = hourly.data[0].temperature < hourly.data[1].temperature ? '\u2191' : '\u2193'

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.w368]}>Current weather for {location}</Text>
      <View style={styles.row_container}>
        <Image
          style={styles.icon}
          source={`/icons/${translateIcon({ icon, summary: currentSummary, currentTime, sunriseTime, sunsetTime })}.svg`}
          alt={icon}
        />

        <View>
          <Text style={styles.summary}>
            {Math.round(temperature)}˚<Text style={styles.temperature_arrow}>{temperatureDirection}</Text> {currentSummary}.
          </Text>
          <Text style={[styles.text, styles.w300]}>
            <Text style={styles.label}>Feels like: </Text> <Text style={styles.temperature}>{Math.round(apparentTemperature)}˚</Text>{' '}
            <Text style={styles.label}>Low: </Text> <Text style={styles.temperature}>{Math.round(temperatureLow)}˚</Text>{' '}
            <Text style={styles.label}>High: </Text> <Text style={styles.temperature}>{Math.round(temperatureHigh)}˚</Text>
          </Text>
          <Text>
            <Text style={styles.label}>Wind: </Text>
            <Text style={styles.temperature}>{`${Math.round(windSpeed)} mph (${bearingToCardinal(windBearing)})`} </Text>
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
  w368: {
    maxWidth: '368px',
  },
  text: {
    fontSize: 16,
  },
  summary: {
    fontSize: 32,
    fontWeight: 600,
    maxWidth: '300px',
    textAlign: 'left',
  },
  w300: {
    maxWidth: '300px',
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
  temperature_arrow: {
    fontSize: '20px',
    marginLeft: '-4px',
  },
})

export default CurrentWeather
