import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setError(null);

    if (!emailAddress || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      const clerkError = err?.errors?.[0];
      const message = clerkError?.message || 'Sign-up failed. Please try again.';
      setError(message);

      if (
        message.includes('already in use') ||
        message.includes('already exists')
      ) {
        Alert.alert(
          'Account exists',
          'An account with this email already exists. Would you like to sign in instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign In',
              onPress: () => router.replace('/(auth)/sign-in'),
            },
          ]
        );
      }

      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setError(null);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.warn('Verification not complete:', signUpAttempt);
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || 'Invalid code. Please try again.';
      setError(message);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontFamily: 'outfit-bold', marginBottom: 20 }}>
          Verify your email
        </Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 14,
            fontSize: 16,
            marginBottom: 16,
            fontFamily: 'outfit',
          }}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 16,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={onVerifyPress}
        >
          <Text style={{ color: Colors.WHITE, fontSize: 18, fontFamily: 'outfit-bold' }}>
            Verify
          </Text>
        </TouchableOpacity>

      {error && <Text style={{ color: 'red', marginTop: 12 }}>{error}</Text>}
    </View>
  )
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: Colors.PRIMARY }]}
        onPress={onSignUpPress}
      >
        <Text style={[styles.buttonText, { color: Colors.WHITE }]}>Continue</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.linkRow}>
        <Text style={{ color: Colors.BLACK }}>Already have an account?</Text>
        <Link href="/(auth)/sign-in">
          <Text style={{ color: Colors.PRIMARY, fontWeight: 'bold' }}> Sign in</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    marginBottom: 24,
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: Colors.BLACK,
    fontFamily: 'outfit',
  },
  button: {
    backgroundColor: Colors.WHITE,
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
  errorText: {
    color: 'red',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: 'outfit',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
})