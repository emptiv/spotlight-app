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
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ClerkAndConvexProvider>
        <LanguageProvider>
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
                <Stack screenOptions={{ headerShown: false }} />
              )}
            </SafeAreaView>
          </SafeAreaProvider>
        </LanguageProvider>
      </ClerkAndConvexProvider>
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
