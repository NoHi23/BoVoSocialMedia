import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../../assets/icons";
import Avatar from "../../components/Avatar";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";

  const Profile = () => { 
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout", error.message);
    }
  };

  const handleLogout = async () => {
    //
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("modal cancelled"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ]);
  };
  return (
    <ScreenWrapper bg="white">
      <UserHeader user={user} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  );
};
const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("editProfile")}
            >
              <Icon name="edit" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>
          {/* user name and address */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user && user.name}</Text>
            <Text style={styles.infoText}>{user && user.address}</Text>
          </View>
          <View style={{ gap: 10 }}>
            {/** Email */}
            <View style={styles.info}>
              <Icon color={theme.colors.textLight} name={"mail"} size={20} />
              <Text style={styles.infoText}>{user && user.email}</Text>
            </View>
            {/* Phone */}
            {user && user.phoneNumber && (
              <View style={styles.info}>
                <Icon color={theme.colors.textLight} name={"call"} size={20} />
                <Text style={styles.infoText}>{user.phoneNumber}</Text>
              </View>
            )}
            {/** Bio */}
            {user && user.bio && (
              <Text style={styles.infoText}>{user.bio}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  avatarContainer: {
    alignSelf: "center",
    height: hp(12),
    width: hp(12),
  },
  container: {
    flex: 1,
  },
  editIcon: {
    backgroundColor: "white",
    borderRadius: 50,
    bottom: 0,
    elevation: 7,
    padding: 7,
    position: "absolute",
    right: -12,
    shadowColor: theme.colors.textLight,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    height: hp(20),
    width: wp(100),
  },
  info: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  infoText: {
    color: theme.colors.textLight,
    fontSize: hp(1.6),
    fontWeight: "500",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: theme.radius.sm,
    padding: 5,
    position: "absolute",
    right: 0,
  },
  noPosts: {
    color: theme.colors.text,
    fontSize: hp(2),
    textAlign: "center",
  },
  userName: {
    color: theme.colors.textDark,
    fontSize: hp(3),
    fontWeight: "500",
  },
});
