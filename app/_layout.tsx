import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";

export default function RootLayout() {
  
  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

    return (
    
    <ClerkAndConvexProvider>
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{headerShown: false}}/>
      </SafeAreaView>
    </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
