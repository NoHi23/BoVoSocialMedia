import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { View } from "react-native-web";
const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  console.log("got post Id: ", postId);
  return (
    <View>
      <Text>PostDetails</Text>
    </View>
  );
};

export default PostDetails;
