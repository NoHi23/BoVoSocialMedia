import { Button, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import Loading from '../components/Loading';
const index = () => {
    const router = useRouter();
    //  điều hướng sang màn hình “welcome” khi bấm button
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Loading />
      </View>
    )
}

export default index