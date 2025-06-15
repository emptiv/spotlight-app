import { SignOutButton } from '@/components/SignOutButton'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} // placeholder image
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>User 1</Text>
            <Text style={styles.username}>@username</Text>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Ionicons name="flame" size={20} color="orange" />
            <Text style={styles.badgeText}>Streak: 5</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="heart" size={20} color="red" />
            <Text style={styles.badgeText}>Hearts: 3</Text>
          </View>
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.signOutButton}>
        <SignOutButton />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  info: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: '#222',
  },
  username: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#666',
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#444',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 22,
  },
  signOutButton: {
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 60,
},
})
