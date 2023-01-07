import Link from 'next/link'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

function Alerts({ alerts }) {
  if (!alerts?.length) {
    return null
  }

  const alertLinks = alerts.map((alert, index) => {
    return (
      <Link key={index} href={alert.uri}>
        <Text style={styles.link_button}> {alert.title} </Text>
      </Link>
    )
  })

  return <View style={styles.row_container}>{alertLinks}</View>
}

const styles = StyleSheet.create({
  row_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  link_button: {
    backgroundColor: '#ffffc8',
    margin: '8px',
    padding: '4px',
    borderRadius: '8px',
    textAlign: 'center',
  },
})

export default Alerts
