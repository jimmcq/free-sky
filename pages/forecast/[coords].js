import React, { useEffect } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import Alerts from '../../components/Alerts'
import CurrentWeather from '../../components/CurrentWeather'
import DayWeather from '../../components/DayWeather'
import HourWeather from '../../components/HourWeather'
import WeekWeather from '../../components/WeekWeather'
import { getForecast } from '../../lib/darksky'
import { getPlaceName } from '../../lib/mapbox'
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getServerSideProps({ query }) {
  const parts = query.coords.split(',')
  const latitude = parseFloat(parts[0]).toFixed(4)
  const longitude = parseFloat(parts[1]).toFixed(4)
  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Invalid location coordinates')
  }

  const forecast = await getForecast({ latitude, longitude })
  const placeName = (await getPlaceName({ latitude: forecast.latitude, longitude: forecast.longitude })) || `${latitude},${longitude}`

  const pageMetadata = { title: `Weather for ${placeName}` }
  const props = { forecast, placeName, pageMetadata }

  return { props }
}

function ForecastPage({ forecast, placeName }) {
  const { currently, minutely, hourly, daily, alerts, latitude, longitude } = forecast

  useEffect(() => {
    ;(async () => {
      const storedLocationList = (await AsyncStorage.getItem('locationList')) || '[]'

      const newList = JSON.parse(storedLocationList)

      let found = false
      newList.forEach(item => {
        if (item.placeName === placeName) {
          found = true
        }
      })

      if (!found) {
        newList.unshift({ placeName, latitude, longitude })
        AsyncStorage.setItem('locationList', JSON.stringify(newList.slice(0, 5)))
      }
    })()
  }, [])

  return (
    <ScrollView style={styles.container}>
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

const styles = StyleSheet.create({
  container: { margin: '8px' },
})

export default ForecastPage
