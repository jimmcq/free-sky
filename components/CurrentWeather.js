import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

function CurrentWeather({ placeName, currently, daily }) {
  const { temperature, summary: currentSummary, apparentTemperature, icon } = currently
  const today = daily.data[0]
  const { temperatureLow, temperatureHigh } = today
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Current weather for {placeName.split(',')[0]}</Text>
      <View style={styles.row_container}>
        <Image style={styles.icon} source={{ uri: `https://darksky.net/images/weather-icons/${icon}.png` }} alt={icon} />

        <View style={styles.ontainer}>
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
