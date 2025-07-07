import { View, Text } from 'react-native'
import React from 'react'
<<<<<<< HEAD
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const ScreenWrapper = ({ children, bg }) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg }}>
      {children}
    </View>
  )
=======
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// useSafeAreaInsets giúp app của bạn KHÔNG hiển thị vào những phần bị che hoặc không an toàn trên màn hình.


const ScreenWrapper = ({ children, bg }) => {
    const { top } = useSafeAreaInsets(); // Lấy giá trị top từ insets để biết khoảng cách 
    const paddingTop = top > 0 ? top + 5 : 30; // Default padding 5 if top inset is not available, else 30
    return (
        <View style={{ flex: 1, paddingTop: paddingTop, backgroundColor: bg }}>
            {children}
        </View>
    )
>>>>>>> c1efa45033c41db4d4080ccdd982ad66c0ae9c41
}

export default ScreenWrapper