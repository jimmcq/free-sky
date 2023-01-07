import React from 'react'
import { ScrollView } from 'react-native'
import CurrentWeather from '../../components/CurrentWeather'
import { getForecast } from '../../lib/darksky'
import { getPlaceName } from '../../lib/mapbox'

export async function getServerSideProps({ query }) {
  const parts = query.coords.split(',')
  const latitude = parts[0]
  const longitude = parts[1]
  const forecast = await getForecast({ latitude, longitude })
  const placeName = await getPlaceName({ latitude, longitude })
  const props = { forecast, placeName }

  return { props }
}

export default function App({ forecast, placeName }) {
  const { currently, hourly, daily } = forecast
  return (
    <ScrollView>
      <CurrentWeather placeName={placeName} currently={currently} hourly={hourly} daily={daily} />
    </ScrollView>
  )
}
