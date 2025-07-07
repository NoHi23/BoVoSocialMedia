import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
<<<<<<< HEAD

const Loading = ({
  size = "large",
  color = theme.colors.primary
}) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
=======
import { theme } from '../constants/theme'
const Loading = ({size='large', color=theme.colors.primary}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})