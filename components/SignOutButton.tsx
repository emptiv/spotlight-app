import { playSound } from '@/constants/playClickSound';
import { COLORS } from '@/constants/theme';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


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
    <TouchableOpacity 
      style={styles.button} 
      onPress={async () => {
        await playSound('click');
        handleSignOut();
      }}
    >
      <Text style={styles.text}>Sign out</Text>
    </TouchableOpacity>
  )
}
  const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
})

