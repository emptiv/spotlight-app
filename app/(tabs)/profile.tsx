import { SignOutButton } from '@/components/SignOutButton'
import { api } from '@/convex/_generated/api'
import { useAuth } from '@clerk/clerk-expo'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

export default function Profile() {
  const { userId: clerkUserId } = useAuth()

  // Get Convex user ID using Clerk ID
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  )

  // Fetch full user record using Convex ID
  const user = useQuery(
    api.users.getUserById,
    convexUserId ? { userId: convexUserId } : "skip"
  )

  const updateName = useMutation(api.users.updateUserName)

  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)

  // Keep local `name` state in sync with fetched user name
  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user?.name])

  const handleSave = async () => {
    try {
      if (!convexUserId) throw new Error('Missing Convex user ID')
      await updateName({ userId: convexUserId, name })
      Alert.alert('Name updated')
      setEditing(false)
    } catch (err) {
      console.error(err)
      Alert.alert('Update failed')
    }
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            {editing ? (
              <>
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
                <Text style={styles.saveText} onPress={handleSave}>
                  Save
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.name}>{user.name || 'Unnamed'}</Text>
                <Text style={styles.editText} onPress={() => setEditing(true)}>
                  Edit Name
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

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
  nameInput: {
    fontSize: 20,
    fontFamily: 'outfit',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#222',
    paddingVertical: 2,
    width: 200,
  },
  saveText: {
    marginTop: 4,
    fontSize: 14,
    color: '#28a745',
    fontFamily: 'outfit-bold',
  },
  editText: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#007AFF',
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
})
