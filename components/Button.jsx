import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common' // hàm hp để tính chiều cao responsive
import Loading from './Loading'
const Button = ({
    buttonStyle,
    textStyle,
    title = '',
    onPress = () => { },
    loading = false,
    hasShadow = true
}) => {

    const shadowStyle = {
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 10 }, // Xác định vị trí bóng lệch so với phần tử gốc
        shadowOpacity: 0.2,
        shadowRadius: 8, // Độ mờ của bóng
        elevation: 4 // cho Android, 4 cái trên là cho iOS
    }
    if (loading) {
        return (
            <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
                <Loading />
            </View>
        )
    }
    return (
        <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary, // màu nền chính từ theme
        height: hp(6.6),                       // chiều cao responsive (hàm hp phải được import!)
        justifyContent: 'center',              // căn giữa nội dung dọc, mặc định View đã có display: 'flex'
        alignItems: 'center',                  // căn giữa nội dung ngang
        borderCurve: 'continuous',             // bo cong mượt hơn (iOS 17+)
        borderRadius: theme.radius.xl          // bo góc lớn từ theme
    },
    text: {
        color: 'white',             // màu chữ trắng từ theme
        fontSize: hp(2.5),                     // kích thước chữ responsive
        fontWeight: theme.fonts.bold
    }
})