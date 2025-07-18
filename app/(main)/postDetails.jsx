import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import PostCard from '../../components/PostCard';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from '../../helpers/common';
import { supabase } from '../../lib/supabase';
import { createNotification } from '../../services/notificationService';
import { createComment, fetchPostDetails, removeComment, removePost } from '../../services/postService';
import { getUserData } from '../../services/userService';

const PostDetails = () => {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleNewComment = async (payload) => {
    console.log('PostDetails - got new comment', payload.new)
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost(prevPost => {
        // Check if comment already exists to avoid duplicates
        const existingComment = prevPost.comments?.find(comment => comment.id === newComment.id);
        if (existingComment) {
          console.log('PostDetails - Comment already exists, skipping...');
          return prevPost;
        }
        
        console.log('PostDetails - Adding new comment');
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments]
        }
      })
    }
  }
  useEffect(() => {
    let commentChannel = supabase
      .channel(`post-details-comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        }, handleNewComment)
      .subscribe();
    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);


  const getPostDetails = async () => {
    // fetch post details here
    if (!postId) {
      console.log('No postId provided');
      setStartLoading(false);
      return;
    }
    let res = await fetchPostDetails(postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  }

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current
    }
    //create comment
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {

      if (user.id != post.userId) {
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: 'đã bình luận về bài đăng của bạn',
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id })
        }
        createNotification(notify);
      }

      // Refresh post details to get updated comments
      await getPostDetails();
      // send notification later
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert('Bình luận', res.msg);
    }
  }

  const onDeleteComment = async (comment) => {
    console.log('deleting comment:', comment);
    let res = await removeComment(comment?.id);
    if (res.success) {
      setPost(prevPost => {
        let updatePost = { ...prevPost };
        updatePost.comments = updatePost.comments.filter(c => c.id !== comment.id);
        return updatePost;
      });
    } else {
      Alert.alert('Bình luận', res.msg);
    }
  };


  const onDeletePost = async (item) => {
    // console.log("delete post: ", item);

    let res = await removePost(post.id);
    if (res.success) {
      router.back();
    } else {
      Alert.alert('Post', res.msg)
    }
  }

  const onEditPost = async (item) => {
    // console.log("edit post: ", item);
    router.back();
    router.push({ pathname: 'newPost', params: { ...item } })
  }


  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
        <Text style={styles.notFound}>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <PostCard
          item={post}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />



        {/*comment input*/}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Nhập bình luận..."
            onChangeText={value => commentRef.current = value}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }}
          />
          {
            loading ? (
              <View style={styles.loading}>
                <Loading size="small" />
              </View>

            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )
          }
        </View>
        {/* comments list*/}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {
            post?.comments?.map(comment =>
              <CommentItem
                key={comment?.id?.toString()}
                item={comment}
                onDelete={onDeleteComment}
                highlight = {comment.id == commentId}
                canDelete={user.id == comment.userId || user.id == post.userId}
              />
            )
          }

          {
            post?.comments?.length === 0 && (
              <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                Hãy là người đầu tiên bình luận!
              </Text>
            )
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: hp(5.8),
    width: hp(5.8)
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }]
  }
})