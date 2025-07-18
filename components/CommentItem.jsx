import moment from 'moment';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../assets/icons';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';
import Avatar from './Avatar';
const CommentItem = ({
    item,
    canDelete = true,
    onDelete = () => { },
    highlight = false
}) => {
    console.log('[CommentItem] created_at raw:', item?.created_at);
    const createdAt = item?.created_at ? moment(item.created_at).format('DD/MM/YYYY HH:mm') : 'Ngày không xác định';
    console.log('[CommentItem] formatted date:', createdAt);
    const handleDelete = () => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn làm điều này không?", [
            {
                text: 'Hủy bỏ',
                onPress: () => console.log("modal cancelled"),
                style: 'cancel',
            },
            {
                text: 'Xóa',
                onPress: () => onDelete(item),
                style: 'destructive',
            },
        ]);
    };
    return (
        <View style={styles.container}>
            <Avatar
                uri={item?.user?.image}
                size={hp(3.5)}
                rounded={theme.radius.md}
            />
            <View style={[styles.content, highlight && styles.highlight]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.text}>
                            {
                                item?.user?.name
                            }
                        </Text>
                        <Text>•</Text>
                        <Text style={[styles.text, { color: theme.colors.textLight }]}>
                            {
                                createdAt
                            }
                        </Text>
                    </View>
                    {
                        canDelete && (
                            <TouchableOpacity onPress={handleDelete}>
                                <Icon name="delete" size={20} color={theme.colors.rose} />
                            </TouchableOpacity>
                        )
                    }

                </View>
                <Text style={[styles.text, { fontWeight: 'normal' }]}>
                    {
                        item?.text
                    }

                </Text>
            </View>
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        gap: 7,
    },
    content: {
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        flex: 1,
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
    },
    highlight: {
        borderWidth: 0.2,
        backgroundColor: 'white',
        borderColor: theme.colors.dark,
        shadowColor: theme.colors.dark,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textDark,
    },
    commentText: {
        fontSize: hp(1.6),
        color: theme.colors.text
    }
});