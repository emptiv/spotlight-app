import { SignOutButton } from '@/components/SignOutButton';
import { playSound } from '@/constants/playClickSound';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useLanguage } from '../../components/LanguageContext';
import Colors from '../../constants/Colors';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { lang, setLang } = useLanguage();
  const isEnglish = lang === 'en';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingVertical: 10 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Top content */}
        <View>
          {/* Language Setting */}
          <View style={styles.languageContainer}>
            <Text style={styles.languageLabel}>Language</Text>
            <View style={styles.languageSwitch}>
              <Text style={styles.languageText}>ENG</Text>
              <Switch
                value={!isEnglish}
                onValueChange={(value) => setLang(value ? 'fil' : 'en')}
                trackColor={{ false: Colors.PRIMARY, true: Colors.PRIMARY }}
                thumbColor={Colors.WHITE}
                ios_backgroundColor={Colors.SECONDARY}
              />
              <Text style={styles.languageText}>FIL</Text>
            </View>
          </View>

          {/* Drawer Items with click sound */}
          <DrawerItemList
            {...props}
            navigation={{
              ...props.navigation,
              navigate: async (...args: Parameters<typeof props.navigation.navigate>) => {
                await playSound('click');
                props.navigation.navigate(...args);
              },
            }}
          />
        </View>

        {/* Bottom Sign Out */}
        <View style={{ padding: 20 }}>
          <Pressable
            onPress={async () => {
              await playSound('click');
              // SignOutButton handles the actual sign out
            }}
          >
            <SignOutButton />
          </Pressable>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const router = useRouter();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'slide',
        drawerStyle: {
          width: 200,
          backgroundColor: '#fff',
        },
        drawerActiveTintColor: '#FF6C32',
        drawerInactiveTintColor: Colors.GRAY,
        drawerItemStyle: {
          marginVertical: 6, // 👈 spacing between page labels
        },
        headerStyle: {
          backgroundColor: Colors.SECONDARY,
          height: 90,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
        headerTitleStyle: {
          fontFamily: 'outfit-bold',
          fontSize: 20,
          color: Colors.BLACK,
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 20 }}>
            {/* Help Button */}
            <Pressable
              onPress={async () => {
                await playSound('click');
                router.push('/help');
              }}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="help-circle" size={30} color={Colors.BLACK} />
            </Pressable>

            {/* Feedback Button */}
            <Pressable
              onPress={async () => {
                await playSound('click');
                router.push('/feedback/feedback');
              }}
            >
              <Ionicons name="chatbox-ellipses" size={26} color={Colors.BLACK} paddingTop={2.5} />
            </Pressable>
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="chapters"
        options={{
          title: 'Lessons',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="practice"
        options={{
          title: 'Practice',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="minigames"
        options={{
          title: 'Mini Games',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden Screens */}
      <Drawer.Screen
        name="screens/lessons"
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Lessons',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ming"
        options={{
          headerShown: false,
          title: 'Ming',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="ming2"
        options={{
          headerShown: false,
          title: 'Ming2',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/TourHomeO"
        options={{
          headerShown: false,
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/TourMapO"
        options={{
          headerShown: false,
          title: 'Map',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/TourPracticeO"
        options={{
          headerShown: false,
          title: 'Practice',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/TourDashboardO"
        options={{
          headerShown: false,
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/TourGamesO"
        options={{
          headerShown: false,
          title: 'Mini Games',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/TourBoardO"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/FakeMap"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/FakeHome"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/FakeGames"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/FakePractice"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/FakeDashboard"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="tour/FakeLeaderboard"
        options={{
          headerShown: false,
          title: 'Leaderboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  languageContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageLabel: {
    fontSize: 14,
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    marginBottom: 8,
  },
  languageSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    marginHorizontal: 6,
  },
});
