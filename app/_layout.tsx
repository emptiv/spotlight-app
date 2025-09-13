import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LanguageProvider } from "../components/LanguageContext";
import ClerkAndConvexProvider from "../providers/ClerkAndConvexProvider";
import CardsPractice from "./practice/cards";

// Configure notification behaviour
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit": require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const [isOffline, setIsOffline] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Setup notifications only if online
  useEffect(() => {
    const setupNotifications = async () => {
      if (isOffline) return;

      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Notification permission not granted");
          return;
        }

        // Cancel previous notifications to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Schedule daily notification at 9:00 AM
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Plumatika",
            body: "MEOW! Have you practiced today, kaibigan?",
          },
          trigger: {
            type: "calendar",
            hour: 9,
            minute: 0,
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });
      } catch (err) {
        console.warn("Failed to setup notifications:", err);
      }
    };

    setupNotifications();
  }, [isOffline]); // Re-run if online/offline status changes

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
