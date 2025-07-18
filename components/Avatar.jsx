import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import { getUserImageSrc } from "../services/imageService";

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded,
  style = {},
}) => {
  const borderRadius = rounded || theme.radius.md;
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[styles.avatar, { height: size, width: size, borderRadius }, style,]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderColor: theme.colors.darkLight,
    borderCurve: "continuous",
    borderWidth: 1,
  },
});
