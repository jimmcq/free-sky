import React from 'react'
import { Text, View } from 'react-native'

function CurrentWeather({ currently, hourly, daily }) {
  console.log(currently)
  const { temperature, summary: currentSummary, apparentTemperature } = currently
  const { summary: hourlySummary } = hourly
  const today = daily.data[0]
  const { temperatureLow, temperatureHigh } = today
  return (
    <View>
      <Text>
        {Math.round(temperature)}˚ {currentSummary}.
      </Text>
      <Text>
        Feels like: {Math.round(apparentTemperature)}˚ Low: {Math.round(temperatureLow)}˚ High: {Math.round(temperatureHigh)}˚
      </Text>
      <Text>{hourlySummary}</Text>
    </View>
  )
}

export default CurrentWeather
