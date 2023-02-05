// @generated: @expo/next-adapter@2.1.52
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import * as Location from 'expo-location'
import { useDebouncedCallback } from 'use-debounce'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setCacheControl } from '../lib/cache-control'
import { normalizeCoordinates } from '../lib/helpers'
import type { NextApiResponse } from 'next'
import type { MapBoxPlace, Place } from '../lib/types'

export async function getServerSideProps({ res }: { res: NextApiResponse<Response> }) {
  setCacheControl({ res, maxAge: 3600 })
  return { props: {} }
}

function IndexPage() {
  const [linkList, setLinkList] = useState<JSX.Element[]>([])

  const debounced = useDebouncedCallback(value => {
    console.log(value)
    if (value.length >= 3) {
      search(value)
    }
  }, 1000)

  useEffect(() => {
    ;(async () => {
      // Get from Storage
      const storedLocationList = await AsyncStorage.getItem('locationList')
      if (storedLocationList) {
        const newList = JSON.parse(storedLocationList)
        setLinkList(
          newList.map((place: Place, index: number) => {
            const { latitude, longitude } = normalizeCoordinates({ latitude: place.latitude, longitude: place.longitude })

            return (
              <Link style={styles.link} key={index} href={`/forecast/${latitude},${longitude}`}>
                <Text>{place.placeName}</Text>
              </Link>
            )
          })
        )
      } else {
        // Get Location
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          return
        }

        const location = await Location.getCurrentPositionAsync({})

        let latitude, longitude
        try {
          ;({ latitude, longitude } = normalizeCoordinates({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          }))
        } catch (error) {
          return
        }

        const url = `/api/getplacename?latitude=${latitude}&longitude=${longitude}`
        const response = await fetch(url)
        const placeName = await response.json()

        setLinkList([
          <Link style={styles.link} key={0} href={`/forecast/${latitude},${longitude}`}>
            <Text>{placeName}</Text>
          </Link>,
        ])
      }
    })()
  }, [])

  async function search(text: string) {
    if (!text) {
      return null
    }
    const url = `/api/searchplace?place=${text}`
    const response = await fetch(url)
    const features = await response.json()

    if (features.length) {
      setLinkList(
        features.map((place: MapBoxPlace, index: number) => {
          const { latitude, longitude } = normalizeCoordinates({
            latitude: place.center[1].toString(),
            longitude: place.center[0].toString(),
          })

          return (
            <Link style={styles.link} key={index} href={`/forecast/${latitude},${longitude}`}>
              <Text>{place.place_name}</Text>
            </Link>
          )
        })
      )
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>When Dark Sky is gone, Free-Sky.Net remains</Text>
      <TextInput style={styles.input} placeholder="Location Search" onChangeText={text => debounced(text)}></TextInput>
      <Text>Enter an address above</Text>
      <Text> {linkList && <Text>or select an address below</Text>} </Text>
      <View style={styles.results}>{linkList}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  results: {
    width: '361px',
    height: '361px',
    marginTop: '16px',
  },
  link: {
    marginBottom: '8px',
  },
})

export default IndexPage
