import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LanguageProvider } from "../components/LanguageContext";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";

import CardsPractice from "./practice/cards";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit": require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {isOffline && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>Offline Mode</Text>
            </View>
          )}

          {isOffline ? (
            <CardsPractice />
          ) : (
            <ClerkAndConvexProvider>
              <LanguageProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </LanguageProvider>
            </ClerkAndConvexProvider>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    backgroundColor: "#ffcc00",
    padding: 8,
    alignItems: "center",
  },
  offlineText: {
    color: "#333",
    fontFamily: "outfit-bold",
  },
});
