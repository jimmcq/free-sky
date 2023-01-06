import React from 'react'
import { ScrollView } from 'react-native'
import CurrentWeather from '../../components/CurrentWeather'
import { getForecast } from '../../lib/darksky'

export async function getServerSideProps({ query }) {
  const parts = query.coords.split(',')
  const latitude = parts[0]
  const longitude = parts[1]
  const forecast = await getForecast({ latitude, longitude })
  const props = forecast

  return { props }
}

export default function App(forecast) {
  const { currently, hourly, daily } = forecast
  return (
    <ScrollView>
      <CurrentWeather currently={currently} hourly={hourly} daily={daily} />
    </ScrollView>
  )
}
