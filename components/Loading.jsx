import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { theme } from '../constants/theme'

const Loading = ({size='large', color}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})