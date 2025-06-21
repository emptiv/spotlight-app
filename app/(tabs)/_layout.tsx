import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import { Text, View } from 'react-native'
import { COLORS } from '../../constants/theme'

export default function TabLayout() {
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
        headerTitle: () => (
          <Text
            style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
            color: COLORS.primary,
            marginLeft: 1,
          }}
          >
        Plumatika
      </Text>
    ),
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="flame" size={20} color="orange" />
          <Text style={{ fontFamily: 'outfit', fontSize: 14, marginLeft: 4 }}>{5}</Text>
        </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="heart" size={20} color="red" />
        <Text style={{ fontFamily: 'outfit', fontSize: 14, marginLeft: 4 }}>{3}</Text>
        </View>
      </View>
),
      headerStyle: {
      height: 90,
      backgroundColor: 'white',
      borderBottomWidth:1,
      borderBottomColor: '#eee',
      },
      tabBarLabel: 'Lessons', tabBarIcon: ({ size, color }) => <Ionicons name="school" size={size} color={color} /> 
      }}
    />
      <Tabs.Screen
        name="practice"
        options={{ 
          headerTitle: () => (
          <Text
            style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
            color: COLORS.primary,
            marginLeft: 1,
          }}>
          Practice
        </Text>
        ),
          tabBarLabel: 'Practice', tabBarIcon: ({ size, color }) => <Ionicons name="flash" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="review"
        options={{ 
          headerTitle: () => (
          <Text
            style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
            color: COLORS.primary,
            marginLeft: 1,
          }}>
          Review
        </Text>
        ),
          tabBarLabel: 'Review', tabBarIcon: ({ size, color }) => <Ionicons name="barbell" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ 
          headerTitle: () => (
          <Text
            style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
            color: COLORS.primary,
            marginLeft: 1,
          }}>
          Leaderboard
        </Text>
        ),
          tabBarLabel: 'Leaderboard', tabBarIcon: ({ size, color }) => <Ionicons name="trophy" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ 
          headerTitle: () => (
          <Text
            style={{
            fontSize: 20,
            fontFamily: 'outfit-bold',
            color: COLORS.primary,
            marginLeft: 1,
          }}>
          Profile
        </Text>
        ),
          tabBarLabel: 'Me', tabBarIcon: ({ size, color }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tabs>
  )
}
