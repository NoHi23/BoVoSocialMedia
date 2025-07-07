import { Pressable, StyleSheet } from 'react-native'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'

const BackButton = ({ size = 26, router }) => {

    return (
        <Pressable style={styles.button}
            onPress={() => router.back()}>
            <Icon name='arrowLeft' strokeWidth={2.5} size={size} color={theme.colors.text} />
        </Pressable>
    )
}

export default BackButton

const styles = StyleSheet.create({

    button: {
        alignSelf: 'flex-start', // căn trái nút
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
    }
})