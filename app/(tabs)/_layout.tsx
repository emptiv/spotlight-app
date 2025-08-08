import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, View } from 'react-native';
import { useLanguage } from '../../components/LanguageContext';
import Colors from '../../constants/Colors';

export default function DrawerLayout() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  return (
    <Drawer
      screenOptions={{
        drawerType: 'slide',
        drawerStyle: {
          width: 200,
          backgroundColor: '#fff',
        },
        drawerActiveTintColor: Colors.PRIMARY,
        drawerInactiveTintColor: Colors.GRAY,
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Language Toggle Button */}
            <Pressable
              onPress={() => setLang(lang === 'en' ? 'fil' : 'en')}
              style={{ marginRight: 20 }}
            >
              <Ionicons
                name={lang === 'en' ? 'globe-outline' : 'globe'}
                size={24}
                color={Colors.BLACK}
              />
            </Pressable>
          <Pressable
            onPress={() => router.push('/help')}
            style={{ marginRight: 20 }}
          >
            <Ionicons name="help-circle-outline" size={24} color={Colors.BLACK} />
          </Pressable>
        </View>
        ),
      }}
    >


      <Drawer.Screen
        name="index"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="chapters"
        options={{
          title: "Lessons",
          drawerIcon: ({ color, size }) => <Ionicons name="school" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="practice"
        options={{
          title: "Practice",
          drawerIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="minigames"
        options={{
          title: "Mini Games",
          drawerIcon: ({ color, size }) => <Ionicons name="game-controller" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="screens/lessons"
        options={{
          drawerItemStyle: { display: 'none' },
          title: "Lessons",
          drawerIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Drawer>

  );
}
