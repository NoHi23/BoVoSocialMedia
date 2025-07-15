import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "../../assets/icons/index";
import Avatar from "../../components/Avatar";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import { fetchNotifications } from "../../services/notificationService";
import { fetchPosts } from "../../services/postService";
import { getUserData } from "../../services/userService";
var limit = 0; // global variable to store the limit for posts
const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const handlePostEvent = async (payload) => {
    console.log('Post event received:', payload);
    
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost?.userId);
      newPost.postLikes = [];
      newPost.comments = [];
      newPost.user = res.success ? res.data : {};
      
      setPosts((prevPosts) => {
        // Check if post already exists to avoid duplicates
        const existingPost = prevPosts.find(post => post.id === newPost.id);
        if (existingPost) return prevPosts;
        return [newPost, ...prevPosts];
      });
    }

    if (payload.eventType === 'DELETE' && payload.old?.id) {
      setPosts(prevPosts => {
        return prevPosts.filter(post => post.id !== payload.old.id);
      });
    }
    
    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id == payload.new.id) {
            return {
              ...post,
              body: payload.new.body,
              file: payload.new.file,
              updated_at: payload.new.updated_at
            };
          }
          return post;
        });
      });
    }
  };
  const [posts, setPosts] = useState([]);

  const getNotificationCount = async () => {
    if (!user?.id) return;
    let res = await fetchNotifications(user.id);
    if (res.success) {
      // Count unread notifications (you might need to add an 'isRead' field to your notifications table)
      // For now, we'll just count all notifications
      setNotificationCount(res.data?.length || 0);
    }
  };

  const handleNewNotification = async (payload) => {
    console.log('got new notification: ', payload);

    if (payload.eventType == 'INSERT' && payload.new && payload.new.id && payload.new.receiverId === user.id) {
      setNotificationCount(prev => prev + 1)
    }
  }

  const handleCommentEvent = async (payload) => {
    console.log('Home - Comment event received:', payload);
    
    if (payload.eventType == "INSERT" && payload?.new?.postId) {
      // Get user data for the new comment
      let newComment = { ...payload.new };
      let res = await getUserData(newComment?.userId);
      newComment.user = res.success ? res.data : {};
      
      console.log('Home - Adding comment to post ID:', payload.new.postId);
      
      // Add comment to the corresponding post
      setPosts(prevPosts => {
        console.log('Home - Current posts in callback:', prevPosts.length);
        const updatedPosts = prevPosts.map(post => {
          if (String(post.id) === String(payload.new.postId)) {
            console.log(`Home - Found post ${post.id}, current comments: ${post.comments?.length || 0}`);
            
            // Check if comment already exists to avoid duplicates
            const existingComment = post.comments?.find(comment => comment.id === newComment.id);
            if (existingComment) {
              console.log('Home - Comment already exists, skipping...');
              return post;
            }
            
            console.log('Home - Adding comment');
            return {
              ...post,
              comments: [...(post.comments || []), newComment]
            };
          }
          return post;
        });
        console.log('Home - Posts updated');
        return updatedPosts;
      });
    }

    if (payload.eventType === 'DELETE' && payload.old?.postId) {
      console.log('Home - Removing comment from post ID:', payload.old.postId);
      // Remove comment from the corresponding post
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (String(post.id) === String(payload.old.postId)) {
            console.log(`Home - Found post ${post.id}, current comments: ${post.comments?.length || 0}, removing 1`);
            return {
              ...post,
              comments: (post.comments || []).filter(comment => comment.id !== payload.old.id)
            };
          }
          return post;
        });
      });
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // Load initial data
    getPosts();
    getNotificationCount();

    let notificationChannel;
    let postsChannel;
    let commentsChannel;

    const subscribeRealtime = async () => {
      // Subscribe to notifications
      notificationChannel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `receiverId=eq.${user.id}`,
          },
          handleNewNotification
        );

      // Subscribe to posts changes
      postsChannel = supabase
        .channel('posts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'posts',
          },
          handlePostEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'posts',
          },
          handlePostEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'posts',
          },
          handlePostEvent
        );

      // Subscribe to comments changes
      commentsChannel = supabase
        .channel('home-comments')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
          },
          handleCommentEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'comments',
          },
          handleCommentEvent
        );

      const { error: notificationError } = await notificationChannel.subscribe();
      const { error: postsError } = await postsChannel.subscribe();
      const { error: commentsError } = await commentsChannel.subscribe();
      
      if (commentsError) {
        console.log('Comments subscription error:', commentsError);
      } else {
        console.log('✅ Subscribed to comments realtime successfully');
      }
      
      if (notificationError) {
        console.log('Notification subscription error:', notificationError);
      } else {
        console.log('✅ Subscribed to notifications realtime successfully');
      }

      if (postsError) {
        console.log('Posts subscription error:', postsError);
      } else {
        console.log('✅ Subscribed to posts realtime successfully');
      }
    };

    subscribeRealtime();

    return () => {
      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
      }
      if (postsChannel) {
        supabase.removeChannel(postsChannel);
      }
      if (commentsChannel) {
        supabase.removeChannel(commentsChannel);
      }
    };
  }, [user?.id]);

  const getPosts = async (isLoadingMore = false) => {
    if (!hasMore && isLoadingMore) return null;
    
    // Only increment limit if we're loading more
    if (isLoadingMore) {
      limit = limit + 10;
    } else if (posts.length === 0) {
      limit = 10;
    }
    
    console.log("fetching post: ", limit);
    let res = await fetchPosts(limit);
    if (res.success) {
      console.log("Posts fetched successfully:", res.data.length);
      if (posts.length === res.data.length && isLoadingMore) setHasMore(false);
      
      // Remove duplicates based on post ID
      const uniquePosts = res.data.filter((post, index, self) => 
        index === self.findIndex(p => p.id === post.id)
      );
      
      setPosts(uniquePosts);
    } else {
      console.log("Failed to fetch posts:", res.msg);
    }
  };

  // const onLogout = async () => {
  //   setAuth(null);
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     Alert.alert("Logout", error.message);
  //   }
  // };
  
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        console.log('Home - Screen focused, refreshing posts and notifications');
        getPosts();
        getNotificationCount();
      }
    }, [user?.id])
  );

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bơ Vơ Social</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => {
              setNotificationCount(0);
              router.push("notifications");
            }}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
              {
                notificationCount > 0 && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{notificationCount}</Text>
                  </View>
                )
              }
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>
        {/* Posts List */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item, index) => `post-${item.id}-${index}`}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={() => {
            console.log("Go to the end");
            getPosts(true);
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>No more post</Text>
              </View>
            )
          }
        />
      </View>

      {/* <Button title="Logout" onPress={onLogout} /> */}
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: wp(4.3),
    width: wp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
});
