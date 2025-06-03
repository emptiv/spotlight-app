import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const onSignUpPress = async () => {
    if (!isLoaded) return

    setError(null)

    if (!emailAddress || !password || !username) {
      setError('Please fill in all fields.')
      return
    }

    try {
      await signUp.create({
        emailAddress,
        username,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      const clerkError = err?.errors?.[0]
      const message = clerkError?.message || 'Sign-up failed. Please try again.'
      setError(message)

      // Handle user already exists (Clerk may vary this message slightly)
      if (
        message.includes('already in use') ||
        message.includes('already exists')
      ) {
        Alert.alert(
          'Account exists',
          'An account with this email or username already exists. Would you like to sign in instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign In',
              onPress: () => router.replace('/(auth)/sign-in'),
            },
          ]
        )
      }

      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    setError(null)

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.warn('Verification not complete:', signUpAttempt)
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || 'Invalid code. Please try again.'
      setError(message)
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
      </View>
    )
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Sign up</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={onSignUpPress}>
        <Text>Continue</Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Text>Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text> Sign in</Text>
        </Link>
      </View>
    </View>
  )
}
