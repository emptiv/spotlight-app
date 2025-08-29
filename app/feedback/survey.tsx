import Colors from '@/constants/Colors';
import { playSound } from '@/constants/playClickSound';
import { api } from '@/convex/_generated/api';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FeedbackSurvey() {
  const { userId } = useLocalSearchParams<{ userId: string }>(); 
  const router = useRouter();
  const surveyId = "plumatika";

  const questions = useQuery(api.feedback.getSurveyQuestions, { surveyId });
  const submitFeedback = useMutation(api.feedback.submitFeedback);

  const [responses, setResponses] = useState<Record<string, { value?: number; response?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!userId) {
    return <Text style={{ padding: 20 }}>Preparing feedback form...</Text>;
  }
  if (questions === undefined) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  // ✅ Require all answers before submission
  const isComplete = questions.every((q) => {
    const r = responses[q.questionId];
    if (q.type === "likert") {
      return r?.value !== undefined;
    } else {
      return r?.response?.trim() !== "";
    }
  });

  const handleLikert = (questionId: string, value: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: { value } }));
  };

  const handleOpen = (questionId: string, response: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: { response } }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await playSound("click");

      const formatted = Object.entries(responses).map(([questionId, r]) => ({
        questionId,
        value: r.value,
        response: r.response,
      }));

      await submitFeedback({ userId, surveyId, responses: formatted });

      Alert.alert("Thank you!", "Your feedback has been submitted.");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50} // pushes content above keyboard
    >
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

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>We Value Your Feedback</Text>
          <Text style={styles.description}>
            Your feedback helps us improve and make your learning experience even better.
          </Text>

          {/* ✅ Rating Guide Section */}
          <View style={styles.guideBox}>
            <Text style={styles.guideTitle}>
              Please evaluate the system using the scale below:
            </Text>
            <Text style={styles.guideSubtitle}>
              (Suriin ang sistema gamit ang ibinigay na sukat)
            </Text>

            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>4 - Excellent (Mahusay)</Text>
              <Text style={styles.ratingText}>3 - Good (Maganda)</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>2 - Fair (Katamtaman)</Text>
              <Text style={styles.ratingText}>1 - Poor (Mahina)</Text>
            </View>
          </View>

          {/* ✅ Survey Questions */}
          {questions.map((q) => (
            <View key={q.questionId} style={styles.card}>
              <Text style={styles.qText}>{q.text.en}</Text>
              {q.text.fil && <Text style={styles.qTextFil}>{q.text.fil}</Text>}

              {q.type === "likert" ? (
                <View style={styles.likertRow}>
                  {[1, 2, 3, 4].map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={[
                        styles.likertCircle,
                        responses[q.questionId]?.value === n && styles.likertSelected,
                      ]}
                      onPress={() => handleLikert(q.questionId, n)}
                    >
                      <Text style={styles.likertLabel}>{n}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder="Type your response..."
                  value={responses[q.questionId]?.response || ""}
                  onChangeText={(t) => handleOpen(q.questionId, t)}
                  multiline
                />
              )}
            </View>
          ))}

          {/* ✅ Submit Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (isSubmitting || !isComplete) && { opacity: 0.5 },
            ]}
            disabled={isSubmitting || !isComplete}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 70,
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
    fontSize: 26,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    fontFamily: "outfit",
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  guideBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
  },
  guideTitle: {
    fontSize: 15,
    fontFamily: "outfit-bold",
    color: "#333",
    marginBottom: 4,
  },
  guideSubtitle: {
    fontSize: 13,
    fontFamily: "outfit",
    fontStyle: "italic",
    color: "#555",
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: "#444",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  likertRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  likertCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#fafafa",
  },
  likertSelected: {
    backgroundColor: Colors.PRIMARY + "22",
    borderColor: Colors.PRIMARY,
  },
  likertLabel: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontFamily: "outfit",
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    fontFamily: "outfit-bold",
    fontSize: 17,
    color: Colors.WHITE,
    textAlign: "center",
  },
  qText: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    color: "#333",
  },
  qTextFil: {
    fontSize: 14,
    fontFamily: "outfit",
    fontStyle: "italic",
    color: "#555",
    marginBottom: 16,
  },
});
