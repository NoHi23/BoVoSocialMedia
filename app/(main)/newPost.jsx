import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../assets/icons";
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Header from '../../components/Header';
import RichTextEditor from "../../components/RichTextEditor";
import ScreenWrapper from '../../components/ScreenWrapper';
import { theme } from "../../constants/theme";
import { useAuth } from '../../contexts/AuthContext';
import { hp, wp } from "../../helpers/common";
import { getSupabaseFileUrl } from "../../services/imageService";
import { createOrUpdatePost } from "../../services/postService";

const NewPost = () => {

  const post = useLocalSearchParams();

  const { user } = useAuth();

  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(file)
  const [checkingWithAI, setCheckingWithAI] = useState(false);

  useEffect(() => {
    if (post && post.id) {
      bodyRef.current = post.body;
      setFile(post.file || null)
      setTimeout(() => {
        editorRef?.current?.setContentHTML(post.body);
      }, 300)
    }
  }, [])

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }
    if (!isImage) {
      mediaConfig = {
        mediaTypes: 'videos',
        allowsEditing: true
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)

    console.log('file', result.assets[0]);

    if (!result.canceled) {
      const selectedFile = result.assets[0];

      setCheckingWithAI(true);
      const isSafe = await checkImageWithGemini(selectedFile.uri);
      setCheckingWithAI(false);
      if (!isSafe) {
        Alert.alert('Ảnh không được phép', 'Hình ảnh chứa nội dung nhạy cảm, vui lòng chọn ảnh khác.');
        return;
      }
      Alert.alert(
        'Ảnh hợp lệ',
        'AI xác nhận đây là hình ảnh hợp lệ, bạn có thể tiếp tục đăng bài.'
      );

      setFile(selectedFile);

    }
  }

  const checkImageWithGemini = async (imageUri) => {
    try {
      const base64 = await getBase64(imageUri);

      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=AIzaSyA8FkJ9XTonXbIsN0rcN-GeLlrmNmUR3EM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64,
                }
              },
              {
                text: "Please analyze this image and respond only with one word: SAFE or UNSAFE. Is this image safe for public viewing (no nudity, violence, or sensitive content)?"
              }
            ]
          }]
        })
      });

      const result = await res.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const normalized = text.trim().toLowerCase();

      console.log("Gemini result: ", normalized);

      if (normalized.includes("unsafe")) return false;
      if (normalized.includes("safe")) return true;

      return false; // fallback nếu không rõ
    } catch (error) {
      console.error("Gemini error", error);
      return true; // fallback nếu lỗi
    }
  };


  const getBase64 = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  };

  const isLocalFile = file => {
    if (!file) return null;
    if (typeof file == 'object') return true;
    return false;
  }

  const getFileType = file => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    if (file.includes('postImage')) {
      return 'image'
    }
    return 'video';

  }

  const getFileUri = file => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri
  }

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert('Post', "Vui lòng chọn một hình ảnh hoặc thêm nội dung bài viết")
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    }

    if (post && post.id) {
      data.id = post.id;
    }

    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    } else {
      Alert.alert('Post', res.msg)
    }

  }

  console.log('file uri: ', getFileUri(file));

  return (

    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <Header title="Tạo bài đăng" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>
                {user && user.name}
              </Text>
              <Text style={styles.publicText}>
                Công khai
              </Text>
            </View>
          </View>


          <View style={styles.textEditor}>
            <RichTextEditor editorRef={editorRef} onChange={body => bodyRef.current = body} />
          </View>

          {
            file && (
              <View style={styles.file}>
                {
                  getFileType(file) == 'video' ? (
                    <Video
                      style={{ flex: 1 }}
                      source={{ uri: getFileUri(file) }}
                      useNativeControls
                      resizeMode="cover"
                      isLooping
                    />
                  ) : (
                    <Image source={{ uri: getFileUri(file) }} resizeMode="cover" style={{ flex: 1 }} />
                  )
                }

                <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                  <Icon name="delete" size={20} color="white" />
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
            <Text style={styles.addImageText}>Thêm vào bài viết của bạn</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6.2) }}
          title={post && post.id ? "Cập nhật" : "Tải lên"}
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />

      </View>
      {checkingWithAI && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>AI đang kiểm tra ảnh...</Text>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4)
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.colors.medium,
    color: theme.colors.textLight,
  },
  textEditor: {

  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  video: {

  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 50,
    padding: 7,
    backgroundColor: 'rgba(255,0,0,0.6)'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },

});
