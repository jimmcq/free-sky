import React from 'react'
import { ScrollView, View } from 'react-native'
import Alerts from '../../components/Alerts'
import CurrentWeather from '../../components/CurrentWeather'
import DayWeather from '../../components/DayWeather'
import HourWeather from '../../components/HourWeather'
import WeekWeather from '../../components/WeekWeather'
import { getForecast } from '../../lib/darksky'
import { getPlaceName } from '../../lib/mapbox'

export async function getServerSideProps({ query }) {
  const parts = query.coords.split(',')
  const latitude = parts[0]
  const longitude = parts[1]
  const forecast = await getForecast({ latitude, longitude })
  const placeName = await getPlaceName({ latitude: forecast.latitude, longitude: forecast.longitude })
  const props = { forecast, placeName }

  return { props }
}

export default function App({ forecast, placeName }) {
  const { currently, minutely, hourly, daily, alerts } = forecast
  return (
    <ScrollView>
      <View>
        <CurrentWeather placeName={placeName} currently={currently} daily={daily} />
      </View>
      <View>
        <Alerts alerts={alerts} />
      </View>
      <View>
        <HourWeather minutely={minutely} />
      </View>
      <View>
        <DayWeather hourly={hourly} />
      </View>
      <View>
        <WeekWeather daily={daily} />
      </View>
    </ScrollView>
  )
}
