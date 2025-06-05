import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: email, // now explicitly email
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.warn('Further steps required:', signInAttempt);
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || 'Sign-in failed. Try again.';
      setError(message);
      Alert.alert('Sign-in error', message);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
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

      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={[styles.buttonText, { color: Colors.WHITE }]}>Continue</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.linkRow}>
        <Text style={{ color: Colors.BLACK }}>Don't have an account?</Text>
        <Link href="/(auth)/sign-up">
          <Text style={{ color: Colors.PRIMARY, fontWeight: 'bold' }}> Sign up</Text>
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
    backgroundColor: Colors.PRIMARY,
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