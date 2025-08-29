import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { api } from "@/convex/_generated/api"; // adjust path if needed
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SURVEY_ID = "plumatika"; // <-- your surveyId

export default function FeedbackIntro() {
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
        <Text style={styles.title}>Please log in to give feedback.</Text>
      </View>
    );
  }

  // While loading
  if (hasSubmitted === undefined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          await playSound("click");
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <Text style={styles.feedbackText}>Your feedback matters</Text>

      <Image
        source={require("@/assets/ming/heart.png")}
        style={styles.feedbackImage}
        resizeMode="contain"
      />
      <Text style={styles.description}>
        We’d love to hear your thoughts about Plumatika. Your feedback helps us improve
        and create a better learning experience for everyone.
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
          <Text style={styles.buttonText}>Start Survey</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#444",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
feedbackImage: {
  width: 250,
  height: 250,
  marginTop: 12,
  alignSelf: "center",
},
feedbackText: {
  fontSize: 24,
  fontFamily: "outfit-bold",
  textAlign: "center",
  marginTop: 20,
  color: Colors.PRIMARY,
},

});
