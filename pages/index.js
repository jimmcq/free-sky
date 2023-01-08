// @generated: @expo/next-adapter@2.1.52
import Link from 'next/link'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-web'
import { searchPlace } from '../lib/mapbox'

function IndexPage() {
  const [linkList, setLinkList] = useState()

  async function handleSubmit(event) {
    const text = event.nativeEvent.text
    if (!text) {
      return null
    }
    const url = `/api/searchplace?place=${text}`
    const response = await fetch(url)
    const features = await response.json()

    if (features.length) {
      setLinkList(
        features.map((place, index) => {
          const latitude = place.center[1]
          const longitude = place.center[0]
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
      <TextInput style={styles.input} placeholder="Location Search" onSubmitEditing={handleSubmit}></TextInput>
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
