import { playSound } from "@/constants/playClickSound";
import { useClerk } from "@clerk/clerk-expo";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter, withLayoutContext } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DrawerNavigator = createDrawerNavigator().Navigator;
export const Drawer = withLayoutContext(DrawerNavigator);

function CustomDrawerContent(props: any) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await playSound("click");
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        {/* Default drawer items */}
        <DrawerItemList {...props} />
      </View>

      {/* Sign Out Button at the bottom */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function AdminLayout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          drawerLabel: "Users",
          title: "Users",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="lessons"
        options={{
          drawerLabel: "Lessons",
          title: "Lessons",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="quiz"
        options={{
          drawerLabel: "Quiz",
          title: "Quiz",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="vocab"
        options={{
          drawerLabel: "Vocabulary",
          title: "Vocabulary",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="achievements"
        options={{
          drawerLabel: "Achievements",
          title: "Achievements",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="surveys"
        options={{
          drawerLabel: "Survey",
          title: "Survey",
          headerRight: () => (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin Mode</Text>
            </View>
          ),
        }}
      />
    </Drawer>
  );
}


const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: "#ff4d4d",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  signOutText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  adminBadge: {
    marginRight: 12,
    backgroundColor: "#6200ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

});
