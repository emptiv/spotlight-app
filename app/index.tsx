import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

const ADMIN_EMAIL = "plumatika.ming@gmail.com";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return null; // or splash screen

  if (isSignedIn) {
    // ✅ If admin, go to admin dashboard
    if (user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return <Redirect href="/admin" />;
    }

    // ✅ Otherwise, go to main app
    return <Redirect href="/(tabs)" />;
  }

  // 🚪 If not signed in, go to landing page
  return <Redirect href="/(auth)/landing" />;
}