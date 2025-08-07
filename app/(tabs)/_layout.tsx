import Ionicons from '@expo/vector-icons/Ionicons';
import { Drawer } from 'expo-router/drawer';
import Colors from '../../constants/Colors';

export default function DrawerLayout() {
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
        name="lessons"
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
          title: "Minigames",
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
    </Drawer>
  );
}
