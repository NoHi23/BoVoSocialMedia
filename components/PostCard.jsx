import { Video } from "expo-av";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";
import { createPostLike, removePostLike } from "../services/postService";
import Avatar from "./Avatar";
import Loading from "./Loading";

const textStyles = {
  color: theme.colors.text,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({ item, currentUser, router, hasShadow = true, showMoreIcon = true, showDelete = false, onDelete = () => { }, onEdit = () => { } }) => {
  // Early return if item is undefined or null
  if (!item) {
    console.log('PostCard: item is undefined');
    return null;
  }

  const shadowStyle = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, []);

  const openPostDetails = () => {
    if (!item?.id) {
      console.log('No item id found for post details');
      return;
    }
    console.log('Opening post details for id:', item.id);
    router.push({ pathname: 'postDetails', params: { postId: item.id } });
  };

  const onLike = async () => {
    if (liked) {
      //remove like
      let updateLikes = likes.filter((like) => like.userId != currentUser?.id);

      setLikes([...updateLikes]);
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log('removed like: ', res);
      if (!res.success) {
        Alert.alert('Post', 'Something went wrong!');
      }
    } else {
      //create like
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike(data);
      console.log('added like: ', res);
      if (!res.success) {
        Alert.alert('Post', 'Something went wrong!');
      }
    }
  };

  const onShare = async () => {
    let content = { message: stripHtmlTags(item?.body) };
    if (item?.file) {
      //download file then share the local uri
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
      setLoading(false);
      content.url = url;
    }
    Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure you want do this?", [
      {
        text: 'Cancel',
        onPress: () => console.log("modal cancelled"),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete(item),
        style: 'destructive',
      },
    ]);
  }



  const createAt = moment(item?.created_at).format("MMM D");
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0] ? true : false;
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        {/* user info and post time  */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name || 'Unknown User'}</Text>
            <Text style={styles.postTime}>{createAt || 'Unknown Date'}</Text>
          </View>
        </View>

        {
          showMoreIcon && (
            <TouchableOpacity onPress={openPostDetails}>
              <Icon
                name="threeDotsHorizontal"
                size={hp(3.4)}
                color={theme.colors.text}
                strokeWidth={3}
              />
            </TouchableOpacity>
          )
        }

        {
          showDelete && currentUser.id == item?.userId && (
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                <Icon name="edit" size={hp(2.5)} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostDelete}>
                <Icon name="delete" size={hp(2.5)} color={theme.colors.rose} />
              </TouchableOpacity>
            </View>
          )
        }

      </View>

      {/* post body and media  */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>

        {/* post image */}
        {item?.file && item?.file?.includes("postImage") && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            style={styles.postMedia}
            transition={100}
            contentFit="cover"
          />
        )}
        {/* post video  */}
        {item?.file && item?.file?.includes("postVideos") && (
          <Video
            style={[styles.postMedia, { height: hp(30) }]}
            source={getSupabaseFileUrl(item?.file)}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
      </View>

      {/* like , comment share  */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length || 0}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments?.length || 0}</Text>
        </View>

        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
