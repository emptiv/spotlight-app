import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

export default function QuizResults() {
  const { stars, score, lessonRoute } = useLocalSearchParams<{
    stars: string;
    score: string; // <-- raw points earned
    lessonRoute?: string;
  }>();

  const router = useRouter();

  const numericStars = Math.max(0, Math.min(3, Number(stars)));
  const totalPoints = Number(score);

  const starDisplay = "⭐".repeat(numericStars) + "☆".repeat(3 - numericStars);

  const message =
    numericStars === 3
      ? "Excellent! Perfect score!"
      : numericStars === 2
      ? "Great work! You're almost there."
      : "Keep practicing! Try again for a better score.";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <Text style={styles.stars}>{starDisplay}</Text>
      <Text style={styles.score}>You earned {totalPoints} points</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        {lessonRoute && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.GRAY }]}
            onPress={() => router.replace(`/quiz/${lessonRoute}` as any)}
          >
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
        )}
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
  stars: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  score: {
    fontSize: 22,
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
