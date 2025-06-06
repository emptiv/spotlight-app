import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null; // or splash screen

  if (isSignedIn) {
    // User is signed in, send them to main app
    return <Redirect href="/(tabs)" />; // or whatever your main screen is
  } else {
    // User is not signed in, send to landing
    return <Redirect href="/(auth)/landing" />;
  }
}
