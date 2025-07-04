import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { COLORS } from '../../constants/theme';

const TabTitle = ({ label }: { label: string }) => (
  <Text
    style={{
      fontSize: 20,
      fontFamily: 'outfit-bold',
      color: COLORS.primary,
      marginLeft: 1,
    }}
  >
    {label}
  </Text>
);

export default function TabLayout() {
  const router = useRouter();

  const commonHeader = {
    headerRight: () => (
      <Pressable onPress={() => router.push("/help")}>
        <Ionicons
          name="help-circle-outline"
          size={24}
          color={COLORS.primary}
          style={{ marginRight: 16 }}
        />
      </Pressable>
    ),
    headerStyle: {
      height: 90,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          position: 'absolute',
          elevation: 0,
          height: 55,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          ...commonHeader,
          headerTitle: () => <TabTitle label="Plumatika" />,
          tabBarLabel: 'Lessons',
          tabBarIcon: ({ size, color }) => <Ionicons name="school" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          ...commonHeader,
          headerTitle: () => <TabTitle label="Practice" />,
          tabBarLabel: 'Practice',
          tabBarIcon: ({ size, color }) => <Ionicons name="flash" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          ...commonHeader,
          headerTitle: () => <TabTitle label="Dashboard" />,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ size, color }) => <Ionicons name="trophy" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          ...commonHeader,
          headerTitle: () => <TabTitle label="Profile" />,
          tabBarLabel: 'Me',
          tabBarIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}