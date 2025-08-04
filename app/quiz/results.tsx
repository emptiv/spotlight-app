import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

type AnswerSummary = {
  symbol: string;
  label: string;
  type: string;
  expected: string;
  result: "correct" | "wrong";
  pointsEarned: number;
};

export default function QuizResults() {
  const { stars, score, lessonRoute, answers } = useLocalSearchParams<{
    stars: string;
    score: string;
    lessonRoute?: string;
    answers?: string;
  }>();

  const router = useRouter();
  const [showAnswers, setShowAnswers] = useState(false);

  const numericStars = Math.max(0, Math.min(3, Number(stars)));
  const totalPoints = Number(score);

  const parsedAnswers: AnswerSummary[] = answers
    ? JSON.parse(decodeURIComponent(answers))
    : [];

  console.log("✅ Raw 'answers' param:", answers);
  console.log("✅ Parsed Answers:", parsedAnswers);

  const message =
    numericStars === 3
      ? "Excellent! Perfect score!"
      : numericStars === 2
      ? "Great work! You're almost there."
      : "Keep practicing! Try again for a better score.";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <View style={styles.starsContainer}>
        {[...Array(3)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < numericStars ? "star" : "star-outline"}
            size={32}
            color={Colors.PRIMARY}
          />
        ))}
      </View>

      <Text style={styles.score}>You earned {totalPoints} points</Text>
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        onPress={() => setShowAnswers((prev) => !prev)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </Text>
      </TouchableOpacity>

      {showAnswers && (
        <View style={styles.answersBox}>
          {parsedAnswers.length === 0 ? (
            <Text style={styles.answerText}>No answers available.</Text>
          ) : (
            parsedAnswers.map((ans, i) => {
              const isCorrect = ans.result === "correct";
              return (
                <View
                  key={i}
                  style={[
                    styles.answerCard,
                    isCorrect ? styles.correctCard : styles.incorrectCard,
                  ]}
                >
                  <Ionicons
                    name={isCorrect ? "checkmark-circle" : "close-circle"}
                    size={22}
                    color={isCorrect ? "green" : "red"}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.answerText}>
                    [{ans.type}] {ans.symbol} ({ans.label}) → {ans.result.toUpperCase()} +{ans.pointsEarned}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  score: {
    fontSize: 20,
    fontFamily: "outfit",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginBottom: 24,
    textAlign: "center",
  },
  toggleButton: {
    marginBottom: 16,
    backgroundColor: Colors.GRAY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.WHITE,
  },
  answersBox: {
    width: "100%",
    marginBottom: 24,
  },
  answerCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    position: "relative",
  },
  correctCard: {
    backgroundColor: "#e6ffec",
    borderColor: "#b2f2bb",
    borderWidth: 1,
  },
  incorrectCard: {
    backgroundColor: "#ffe6e6",
    borderColor: "#f5c2c7",
    borderWidth: 1,
  },
  cardIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  answerRow: {
    paddingVertical: 6,
  },
  answerText: {
    fontFamily: "outfit",
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
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
