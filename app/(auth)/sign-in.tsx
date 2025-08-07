import { playSound } from '@/constants/playClickSound';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError(null);

    try {
      await playSound('click');

      const signInAttempt = await signIn.create({
        identifier: email,
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
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Good to see you again! Let's scribble our way to ace Baybayin!</Text>

      <Image
        source={require('../../assets/images/login.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        style={styles.buttonDark}
        onPress={async () => {
          await playSound('click');
          onSignInPress();
        }}
      >
        <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Sign In</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.linkRow}>
        <TouchableOpacity
          onPress={async () => {
            await playSound('click');
            router.push('/(auth)/sign-up');
          }}
        >
          <Text style={{ fontFamily: 'outfit-bold', color: Colors.PRIMARY }}>
            Don't have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 24,
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 35,
    fontFamily: 'outfit-bold',
    marginBottom: 1,
    color: Colors.PRIMARY,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#666',
    textAlign: 'left',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 6,
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
  buttonText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
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
  buttonDark: {
    marginTop: 10,
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    width: '65%',
    alignSelf: 'center',
  },
});
