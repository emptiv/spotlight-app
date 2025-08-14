import { playSound } from '@/constants/playClickSound';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
      await playSound('click');

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
              onPress: async () => {
                await playSound('click');
                router.replace('/(auth)/sign-in');
              },
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
      await playSound('click');
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'height' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>We've sent a code to your email. Enter it below to continue.</Text>

            <Image
              source={require('../../assets/images/verify.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="123456"
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.buttonDark} onPress={onVerifyPress}>
              <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Verify</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'height' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.subtitle}>Write the past, shape the future.</Text>

          <Image
            source={require('../../assets/images/signup.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="juandelacruz@gmail.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="8-32 chars, include letters and numbers"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.buttonDark} onPress={onSignUpPress}>
            <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Sign Up</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.linkRow}>
            <TouchableOpacity
              onPress={async () => {
                await playSound('click');
                router.push('/(auth)/sign-in');
              }}
            >
              <Text style={{ fontFamily: 'outfit-bold', color: Colors.PRIMARY }}> Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  button: {
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
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
