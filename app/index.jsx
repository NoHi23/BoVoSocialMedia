import { Button, Text } from 'react-native';

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
}

export default index