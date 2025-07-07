import { View, Text, Button } from 'react-native'
import React from 'react'
<<<<<<< HEAD
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper';
const index = () => {

  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button title='welcome' onPress={() => router.push('welcome')}></Button>
    </ScreenWrapper>
  )
=======
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
const index = () => {
    const router = useRouter();
    //  điều hướng sang màn hình “welcome” khi bấm button
    return (
        <ScreenWrapper>
            <Text>index</Text>
            <Button title='welcome' onPress={() => router.push('Welcome')} />
        </ScreenWrapper>
    )
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
}

export default index