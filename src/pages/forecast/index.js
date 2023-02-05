import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import { useRouter } from 'next/router'
import { setCacheControl } from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'

export async function getServerSideProps({ res }) {
  setCacheControl({ res, maxAge: 0 })
  return { props: {} }
}

function App() {
  const router = useRouter()
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
      const { latitude, longitude } = normalizeCoordinates({ latitude: location.coords.latitude, longitude: location.coords.longitude })

      router.push(`/forecast/${latitude},${longitude}`)
    })()
  }, [])

  let text = 'Waiting..'
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    const { latitude, longitude } = normalizeCoordinates({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    text = `Redirecting to /forecast/${latitude},${longitude}`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
})

export default App
