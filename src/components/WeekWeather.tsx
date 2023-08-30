import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DayDetail from './DayDetail'
import type { WeatherInfo } from '../lib/types'

function WeekWeather({ daily }: { daily: WeatherInfo }) {
    const { summary: dailySummary } = daily

    const dailyDetails = daily.data.map((dayDetail, index) => {
        return <DayDetail key={index} day={dayDetail} index={index} />
    })

    return (
        <View style={styles.container}>
            <Text style={styles.daily_summary}>{dailySummary}</Text>
            {dailyDetails}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 16,
    },
    daily_summary: {
        fontSize: 22,
        fontWeight: '300',
        maxWidth: 361,
    },
})

export default WeekWeather
