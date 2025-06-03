import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [identifier, setIdentifier] = React.useState('') // can be username or email
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const onSignInPress = async () => {
    if (!isLoaded) return

    setError(null)

    try {
      const signInAttempt = await signIn.create({
        identifier,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.warn('Further steps required:', signInAttempt)
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || 'Sign-in failed. Try again.'
      setError(message)

      Alert.alert('Sign-in error', message)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Sign in</Text>

      <TextInput
        autoCapitalize="none"
        value={identifier}
        placeholder="Enter email or username"
        onChangeText={setIdentifier}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={onSignInPress}>
        <Text>Continue</Text>
      </TouchableOpacity>

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text>Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text> Sign up</Text>
        </Link>
      </View>
    </View>
  )
}
