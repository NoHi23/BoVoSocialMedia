import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const Input = (props) => {
<<<<<<< HEAD
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {
        props.icon && props.icon
      }
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  )
=======
    return (
        <View style={[styles.container, props.containerStyle && props.containerStyle]}>
            {
                props.icon && props.icon
            }
            <TextInput style={{ flex: 1 }}
                placeholderTextColor={theme.colors.textLight}
                ref={props.inputRef && props.inputRef} {...props} />
        </View>
    )
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
}

export default Input

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12
  }
=======
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous', // bo cong mượt hơn (iOS 17+)
        paddingHorizontal: 18,
        gap: 12
    }
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
})