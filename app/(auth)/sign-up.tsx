import { playSound } from '@/constants/playClickSound';
import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);

  const handleProceed = async () => {
    setShowPrivacyModal(false);

    if (!isLoaded) return;
    setError(null);

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
        setShowPrivacyModal(false);
        router.replace('/(auth)/sign-in');
      }

      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onSignUpPress = async () => {
    if (!emailAddress || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setShowPrivacyModal(true); // 👈 show modal instead of Alert
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setError(null);

    try {
      await playSound('click');
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)/ming');
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              autoCapitalize="none"
              placeholder="8-32 chars, letters and numbers"
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

      {/* Privacy Notice Modal */}
      <Modal
        transparent={true}
        visible={showPrivacyModal}
        animationType="fade"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Data Privacy Notice</Text>
            <Text style={styles.modalText}>
              By proceeding, you consent to your data being used for academic and research purposes.
              Your information will be handled securely and responsibly.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setShowPrivacyModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.SECONDARY }]}
                onPress={handleProceed}
              >
                <Text style={[styles.modalButtonText, { color: Colors.PRIMARY }]}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
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
  image: { width: '100%', height: 250, marginBottom: 24 },
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
  eyeIcon: { paddingLeft: 8 },
  buttonDark: {
    marginTop: 10,
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    width: '65%',
    alignSelf: 'center',
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
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 12,
    color: Colors.PRIMARY,
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'outfit',
    color: '#333',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 15,
    fontFamily: 'outfit-bold',
  },
});
