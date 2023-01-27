// @generated: @expo/next-adapter@2.1.52
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import * as Location from 'expo-location'
import { useDebouncedCallback } from 'use-debounce'
import AsyncStorage from '@react-native-async-storage/async-storage'
import setCacheControl from '../lib/cache-control'
import { normalizeCoordinates } from '../lib/helpers'
import { PermissionStatus, createPermissionHook, Platform } from 'expo-modules-core'

export async function getServerSideProps({ res }) {
  setCacheControl({ res, maxAge: 3600 })
  return { props: {} }
}

function IndexPage() {
  const [linkList, setLinkList] = useState()

  const debounced = useDebouncedCallback(value => {
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
          newList.map((place, index) => {
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
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          return
        }

        let location = await Location.getCurrentPositionAsync({})

        let latitude, longitude
        try {
          ;({ latitude, longitude } = normalizeCoordinates({ latitude: location.coords.latitude, longitude: location.coords.longitude }))
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

  async function search(text) {
    if (!text) {
      return null
    }
    const url = `/api/searchplace?place=${text}`
    const response = await fetch(url)
    const features = await response.json()

    if (features.length) {
      setLinkList(
        features.map((place, index) => {
          const { latitude, longitude } = normalizeCoordinates({ latitude: place.center[1], longitude: place.center[0] })

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
      <TextInput style={styles.input} placeholder="Location Search" onChange={e => debounced(e.target.value)}></TextInput>
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
