import { playSound } from '@/constants/playClickSound';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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

const ADMIN_EMAIL = "plumatika.ming@gmail.com";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<'signIn' | 'requestReset' | 'resetPassword'>('signIn');
  const [showPassword, setShowPassword] = React.useState(false);

  // --- Sign In flow ---
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

        // ✅ Use the typed-in email for admin check
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          router.replace('../admin'); // go to admin dashboard
        } else {
          router.replace('/(tabs)'); // go to normal user tabs
        }
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

  // --- Forgot Password Step 1: Request reset ---
  const requestPasswordReset = async () => {
    if (!isLoaded) return;
    setError(null);
    try {
      await playSound('click');
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStage('resetPassword');
      Alert.alert('Check your email', 'We sent you a code to reset your password.');
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || 'Failed to send reset email.';
      setError(message);
      Alert.alert('Error', message);
    }
  };

  // --- Forgot Password Step 2: Submit code + new password ---
  const resetPassword = async () => {
    if (!isLoaded) return;
    setError(null);
    try {
      await playSound('click');
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });

        // ✅ Same admin check after password reset
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          router.replace('../admin');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        console.warn('Further steps required:', result);
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || 'Failed to reset password.';
      setError(message);
      Alert.alert('Error', message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'height' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>
            {stage === 'signIn' ? 'Welcome back!' : 'Reset Password'}
          </Text>
          <Text style={styles.subtitle}>
            {stage === 'signIn'
              ? "Good to see you again! Let's scribble our way to ace Baybayin!"
              : stage === 'requestReset'
              ? 'Enter your email and we will send you a reset code.'
              : 'Enter the code from your email and your new password.'}
          </Text>

          {stage === 'signIn' && (
            <Image source={require('../../assets/images/login.png')} style={styles.image} resizeMode="contain" />
          )}

          {/* Email Field */}
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

          {/* Password Field (Sign In) */}
          {stage === 'signIn' && (
            <>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  await playSound('click');
                  setStage('requestReset');
                }}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Reset Request Button */}
          {stage === 'requestReset' && (
            <TouchableOpacity style={styles.buttonDark} onPress={requestPasswordReset}>
              <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Send Reset Email</Text>
            </TouchableOpacity>
          )}

          {/* Reset Password Fields */}
          {stage === 'resetPassword' && (
            <>
              <Text style={styles.label}>Reset Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter code"
                value={code}
                onChangeText={setCode}
                placeholderTextColor="#aaa"
              />
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.buttonDark} onPress={resetPassword}>
                <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Sign In Button */}
          {stage === 'signIn' && (
            <TouchableOpacity style={styles.buttonDark} onPress={onSignInPress}>
              <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>Sign In</Text>
            </TouchableOpacity>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {stage === 'signIn' && (
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
          )}

          {(stage === 'requestReset' || stage === 'resetPassword') && (
            <TouchableOpacity
              onPress={async () => {
                await playSound('click');
                setStage('signIn');
              }}
              style={{ marginTop: 20 }}
            >
              <Text style={{ fontFamily: 'outfit', color: Colors.PRIMARY }}>Back to Sign In</Text>
            </TouchableOpacity>
          )}
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    padding: 14,
    color: Colors.BLACK,
    fontFamily: 'outfit',
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  forgotPassword: {
    fontFamily: 'outfit',
    color: Colors.PRIMARY,
    textAlign: 'right',
    marginBottom: 16,
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
