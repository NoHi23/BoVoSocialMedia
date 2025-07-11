import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRendererEngineProvider",
]);

// Nếu trong folder có _layout.js, nó luôn được render và bọc tất cả các route con
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};
const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  const updateUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) setUserData({ ...res.data, email });
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("session user: ", session?.user?.id);
      if (session) {
        // set auth
        setAuth(session?.user);
        // update user data in local storage
        updateUserData(session?.user, session?.user?.email);
        // console.log("auth user: ", session?.user?.email);
        // move to home screen
        router.replace("/Home");
      } else {
        // set auth to null
        setAuth(null);
        // move to welcome screen
        router.replace("/Welcome");
      }
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="postDetails" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default _layout;
