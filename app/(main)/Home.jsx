import { Alert, Button, StyleSheet, Text } from 'react-native'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'


const Home = () => {
  const { setAuth, user } = useAuth();

  console.log('user', user);
  
  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout', error.message);
    }
  }
  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button title='Logout' onPress={onLogout} />
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})