// @generated: @expo/next-adapter@2.1.52
import Link from 'next/link'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-web'
import { useDebouncedCallback } from 'use-debounce'

function IndexPage() {
  const [linkList, setLinkList] = useState()

  const debounced = useDebouncedCallback(value => {
    if (value.length >= 3) {
      search(value)
    }
  }, 1000)

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
          const latitude = parseFloat(place.center[1]).toFixed(4)
          const longitude = parseFloat(place.center[0]).toFixed(4)
          return (
            <Link key={index} href={`/forecast/${latitude},${longitude}`}>
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
      <View>{linkList}</View>
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
})

export default IndexPage
