import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useLanguage } from '../../components/LanguageContext';
import Colors from '../../constants/Colors';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { lang, setLang } = useLanguage();
  const isEnglish = lang === 'en';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
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

      {/* Default Drawer Items */}
      <DrawerItemList {...props} />
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
          <Pressable onPress={() => router.push('/help')} style={{ marginRight: 20 }}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.BLACK} />
          </Pressable>
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
