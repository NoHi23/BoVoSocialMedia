import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { wp, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router' // Import useRouter from expo-router to navigate between screens
const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper bg='white'>
            <StatusBar style='dark' />
            <View style={styles.container}>
                {/* welcome image  */}
                <Image style={styles.welcomeImage} source={require('../assets/images/welcome.png')} />
                {/* title  */}
                <View style={{ gap: 20, marginTop: hp(10) }}>
                    <Text style={styles.title}>Linkup!</Text>
                    <Text style={styles.punchline}>
                        Where every thoughts finds a home and every image tells a story</Text>
                </View>
                {/* footer  */}
                <View style={styles.footer}>
                    <Button title='Getting Started'
                        buttonStyle={{ marginHorizontal: wp(10) }}
                        onPress={() => {router.push('SignUp')}} // Navigate to login screen when button is pressed
                    />
                    <View style={styles.bottomTextContainer}>
                        <Text>
                            Already have an account?
                        </Text>
                        <Pressable onPress={() => router.push('Login')}>
                            <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                                Sign in
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        width: wp(80), // 100% width of the screen
        height: hp(30),
        alignSelf: 'center',

    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
    },
    punchline: {
        color: theme.colors.text,
        fontSize: hp(1.7),
        textAlign: 'center',
        paddingHorizontal: wp(10),
    },
    footer: {
        marginTop: hp(5),
        gap: 30,
        width: '100%',
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: hp(2),
    },
    loginText: {
        color: theme.colors.text,
        textAlign: 'center',
        fontSize: hp(1.6),
    }
})