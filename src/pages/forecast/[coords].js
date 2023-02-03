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
import { useRouter } from 'next/router'
import setCacheControl from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'

export async function getServerSideProps({ res, query }) {
  setCacheControl({ res, maxAge: 180 })
  const parts = query.coords.split(',')
  const { latitude, longitude } = normalizeCoordinates({ latitude: parts[0], longitude: parts[1] })

  let forecast = {}
  try {
    forecast = await getForecast({ latitude, longitude })
  } catch (e) {
    throw new Error('Error retrieving forecast data')
  }

  if (forecast?.latitude === undefined || forecast?.longitude === undefined) {
    throw new Error('Invalid forecast data')
  }

  const placeName = (await getPlaceName({ latitude: forecast.latitude, longitude: forecast.longitude })) || `${latitude},${longitude}`

  const pageMetadata = { title: `Weather for ${placeName}` }
  const props = { forecast, placeName, pageMetadata }

  return { props }
}

function ForecastPage({ forecast, placeName }) {
  const router = useRouter()

  // Refresh server side props every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        router.replace(router.asPath)
      } catch (e) {
        // Do nothing
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

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
        <CurrentWeather placeName={placeName} currently={currently} hourly={hourly} daily={daily} />
      </View>
      <View>
        <Alerts alerts={alerts} />
      </View>
      <View>
        <HourWeather minutely={minutely} hourly={hourly} />
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
