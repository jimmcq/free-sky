import { Image, StyleSheet, Text, View } from 'react-native'

function Custom500() {
  return (
    <View style={styles.container}>
      <Text>
        <Text style={styles.status_code}>500</Text> Server-side error occurred.
      </Text>
      <Image style={styles.icon} source={'/icons/chancetstorms.svg'} width={'380px'} />
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
    fontSize: '14px',
  },
  status_code: {
    fontSize: '24px',
    fontWeight: '500',
    marginRight: '20px',
  },
  icon: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '368px',
    width: 368,
    height: 368,
  },
})

export default Custom500
