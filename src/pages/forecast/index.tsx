import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { LocationObject, requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { useRouter } from 'next/router'
import { setCacheControl } from '../../lib/cache-control'
import { normalizeCoordinates } from '../../lib/helpers'
import { NextApiResponse } from 'next'

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
    setCacheControl({ res, maxAge: 0 })
    return { props: {} }
}

function App() {
    const router = useRouter()
    const [location, setLocation] = useState<LocationObject>()
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        ;(async () => {
            const { status } = await requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied')
                return
            }

            const location = await getCurrentPositionAsync({})
            setLocation(location)
            const { latitude, longitude } = normalizeCoordinates({
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
            })

            router.push(`/forecast/${latitude},${longitude}`)
        })()
    }, [])

    let text = 'Waiting..'

    if (errorMsg) {
        text = errorMsg
    } else if (location) {
        const { latitude, longitude } = normalizeCoordinates({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
        })
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
