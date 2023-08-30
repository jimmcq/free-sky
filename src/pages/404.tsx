import ColorSkycons, { ColorSkyconsType } from 'react-color-skycons'
import { StyleSheet, Text, View } from 'react-native'

function Custom404() {
    return (
        <View style={styles.container}>
            <Text>
                <Text style={styles.status_code}>404</Text> This page could not be found.
            </Text>
            <ColorSkycons style={styles.icon} type={ColorSkyconsType.FOG} animate={true} size={375} resizeClear={true} />
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
        fontSize: 14,
    },
    status_code: {
        fontSize: 24,
        fontWeight: '500',
        marginRight: 20,
    },
    icon: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 375,
        width: 375,
        height: 375,
    },
})

export default Custom404
