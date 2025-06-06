import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function QuizResults() {
  const { total, correct } = useLocalSearchParams<{ total: string; correct: string }>();
  const router = useRouter();

  const score = Number(correct);
  const totalQuestions = Number(total);
  const passed = score / totalQuestions >= 0.7;

  const message = passed
    ? "Great job! You passed the quiz."
    : "Keep practicing! You can try again.";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      <Text style={styles.score}>
        You got {score} out of {totalQuestions} correct
      </Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.GRAY }]}
          onPress={() => router.replace(`/quiz/q-lesson-1`)}
        >
          <Text style={styles.buttonText}>Retake Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    marginBottom: 16,
    textAlign: "center",
  },
  score: {
    fontSize: 20,
    fontFamily: "outfit",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: "outfit",
    marginBottom: 24,
    textAlign: "center",
    color: Colors.GRAY,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 12,
    width: "100%",
  },
  button: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});
