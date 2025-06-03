import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Navigate back to the root or sign-in page after sign out
      router.replace('/(auth)/sign-in')  // or router.replace('/(auth)/sign-in')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  )
}
