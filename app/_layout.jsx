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
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log("session user: ", session?.user?.id);

      if (session) {
        setAuth(session?.user);       
        updateUserData(session?.user, session?.user?.email);
        router.replace("/Home");
      } else {       
        setAuth(null);       
        router.replace("/Welcome");
      }
    });
  }, []);

  const updateUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) setUserData({ ...res.data, email });
  };
  return (
    <Stack screenOptions={{ 
      headerShown: false 
      }}
      >
      <Stack.Screen 
      name="(main)/postDetails" 
      options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default _layout;
