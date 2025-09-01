import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SURVEY_ID = "plumatika"; // <-- same as in Intro

export default function SurveyConsent() {
  const { userId } = useAuth();
  const router = useRouter();

  // ✅ Check if user already completed survey
  const hasSubmitted = useQuery(api.feedback.hasSubmittedFeedback, {
    userId: userId || "",
    surveyId: SURVEY_ID,
  });

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to continue.</Text>
      </View>
    );
  }

  if (hasSubmitted === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          await playSound("click");
          router.replace("/(tabs)");
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <Text style={styles.title}>Survey Participation Notice</Text>

      <Text style={styles.description}>
        By joining this short survey, you are helping us improve{" "}
        <Text style={{ fontFamily: "outfit-bold" }}>Plumatika</Text>. Your answers are voluntary,
        confidential, and used only for academic research in line with the{" "}
        <Text style={{ fontFamily: "outfit-bold" }}>Data Privacy Act of 2012</Text>.
      </Text>

      <Text style={styles.description}>
        You may stop anytime, and your responses will remain private. The survey only takes a few
        minutes to complete. By continuing, you agree to participate voluntarily.
      </Text>

      {hasSubmitted ? (
        <Text style={{ fontSize: 16, color: "gray", textAlign: "center", fontFamily: "outfit" }}>
          You’ve already completed this survey. Thank you!
        </Text>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await playSound("click");
            router.push({
              pathname: "/feedback/survey",
              params: { userId, surveyId: SURVEY_ID },
            });
          }}
        >
          <Text style={styles.buttonText}>I Agree, Continue</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.WHITE,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 24,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
});
