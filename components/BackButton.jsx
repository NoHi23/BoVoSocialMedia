import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'

const BackButton = ({ size = 26, router }) => {
<<<<<<< HEAD
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon name='arrowLeft' strokeWidth={2.5} size={size} color={theme.colors.text} />
    </Pressable>
  )
=======
    return (
        <Pressable style={styles.button}
            onPress={() => router.back()}>
            <Icon name='arrowLeft' strokeWidth={2.5} size={size} color={theme.colors.text} />
        </Pressable>
    )
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
}

export default BackButton

const styles = StyleSheet.create({
<<<<<<< HEAD
  button: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.07)'
  }
=======
    button: {
        alignSelf: 'flex-start', // căn trái nút
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
    }
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
})