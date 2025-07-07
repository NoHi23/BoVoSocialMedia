import { View, Text } from 'react-native'
import React, { use, useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'

// Nếu trong folder có _layout.js, nó luôn được render và bọc tất cả các route con
const _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )

}
const MainLayout = () => {
    const { setAuth, setUserData } = useAuth();
    const router = useRouter();

    const updateUserData = async (user) => {
        let res = await getUserData(user?.id);
        if(res.success) {
            setUserData(res.data);
        }
    }

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('session user: ', session?.user?.id);
            if (session) {
                // set auth
                setAuth(session?.user);
                // update user data in local storage
                updateUserData(session?.user);
                // move to home screen
                router.replace('/Home');
            } else {
                // set auth to null
                setAuth(null);
                // move to welcome screen
                router.replace('/Welcome');

            }
        })
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}

export default _layout