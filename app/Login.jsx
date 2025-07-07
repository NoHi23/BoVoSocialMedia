import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '../assets/icons'; // vì Icon đc viết trong index.jsx nên có thể import như vậy
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { supabase } from '../lib/supabase'; // import supabase client
const Login = () => {
    const router = useRouter();
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [loading, setLoading] = useState(false);

    const onsubmit = async () => {
        const email = emailRef.current.trim();
        const password = passwordRef.current.trim();
        // check if email and password are filled
        if (!email || !password) {
            Alert.alert('Login', 'Please fill all fields');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email, password
        })
        setLoading(false);
        console.log('error', error);
        if (error) {
            Alert.alert('Login', error.message);
        }
    }
    return (
        <ScreenWrapper>
            <StatusBar style='dark' />
            <View style={styles.container}>
                <BackButton router={router} />

                {/* welcome  */}
                <View>
                    <Text style={styles.welcomeText}>Hey</Text>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                </View>

                {/* form  */}
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                        Please login to continue
                    </Text>
                    <Input icon={<Icon name='mail' size={26} strokeWidth={1.6} />}
                        placeholder='Enter your email' onChangeText={value => { emailRef.current = value }} />
                    <Input icon={<Icon name='lock' size={26} strokeWidth={1.6} />}
                        placeholder='Enter your password' onChangeText={value => { passwordRef.current = value }}
                        secureTextEntry />
                    <Text style={styles.forgotPaswword}>
                        Forgot Password?
                    </Text>
                    {/* button  */}
                    <Button title={'Login'} loading={loading} onPress={onsubmit} />
                </View>

                {/* footer  */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account?
                    </Text>
                    <Pressable onPress={() => router.push('SignUp')}>
                        <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>
                            Sign up
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25
    },
    forgotPaswword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    }

})