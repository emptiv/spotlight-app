import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function QuizMonitoring() {
  const recentQuizzes = useQuery(api.adm_quiz.recentQuizAttempts);
  const typingStats = useQuery(api.adm_quiz.typingChallengeStats);
  const commonMistakes = useQuery(api.adm_quiz.mostCommonMistakes);
  const hardestSymbols = useQuery(api.adm_quiz.hardestSymbolsByType);

  if (!recentQuizzes || !typingStats || !commonMistakes || !hardestSymbols) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "#4caf50";
    if (accuracy >= 70) return "#ff9800";
    return "#f44336";
  };

  const getStarsColor = (stars: number) => {
    if (stars >= 3) return "#ffd700";
    if (stars === 2) return "#ffb400";
    return "#ccc";
  };

  return (
    <FlatList
      data={commonMistakes}
      keyExtractor={(item, idx) => `${item.symbol}-${idx}`}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      ListHeaderComponent={
        <>
          <Text style={styles.pageTitle}>Quiz Monitoring</Text>

          {/* Typing Challenge Summary */}
          <Text style={styles.sectionTitle}>Typing Challenge Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Average Accuracy</Text>
              <Text style={styles.statValue}>
                {Math.round(typingStats.avgAccuracy)}%
              </Text>
            </View>
          </View>

          {/* Hardest Symbols by Type */}
          <Text style={styles.sectionTitle}>Hardest Symbols</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>MCQ</Text>
              <Text style={styles.statValue}>
                {hardestSymbols.mcq || "-"}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Writing</Text>
              <Text style={styles.statValue}>
                {hardestSymbols.writing || "-"}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Drag</Text>
              <Text style={styles.statValue}>
                {hardestSymbols.drag || "-"}
              </Text>
            </View>
          </View>

          {/* Recent Quiz Attempts */}
          <Text style={styles.sectionTitle}>Recent Quiz Attempts</Text>
          <FlatList
            data={recentQuizzes}
            keyExtractor={(item) => item.attemptId}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2, marginBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.quizCard}>
                <Text style={styles.quizUser}>{item.userName}</Text>
                <Text style={styles.quizLesson}>{item.lessonTitle}</Text>
                <Text
                  style={[
                    styles.quizAccuracy,
                    {
                      color: getAccuracyColor(
                        Math.round(
                          (item.correctAnswers / item.totalQuestions) * 100
                        )
                      ),
                    },
                  ]}
                >
                  Accuracy:{" "}
                  {Math.round(
                    (item.correctAnswers / item.totalQuestions) * 100
                  )}
                  %
                </Text>
                <Text
                  style={[
                    styles.quizStars,
                    { color: getStarsColor(item.earnedStars) },
                  ]}
                >
                  ⭐ {item.earnedStars}
                </Text>
                <Text style={styles.quizDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          />

          <Text style={styles.sectionTitle}>Most Common Mistakes</Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.mistakeCard}>
          <Text style={styles.mistakeSymbol}>
            {item.symbol || "[blank]"}
          </Text>
          <Text style={styles.mistakeInfo}>
            Mistakes: {item.count}
          </Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

const styles = StyleSheet.create({
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },

  // Titles
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: -5,
    marginBottom: 8,
    color: "#444",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: { fontSize: 13, color: "#666", marginTop: 4 },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },

  // Quiz Cards
  quizCard: {
    width: screenWidth * 0.7,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  quizUser: { fontSize: 18, fontWeight: "600", color: "#333" },
  quizLesson: { fontSize: 14, color: "#666", marginTop: 2 },
  quizAccuracy: { fontSize: 14, marginTop: 6, fontWeight: "bold" },
  quizStars: { fontSize: 16, marginTop: 4, fontWeight: "bold" },
  quizDate: { fontSize: 12, color: "#999", marginTop: 6 },

  // Mistakes
  mistakeCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  mistakeSymbol: { fontSize: 29, fontWeight: "600", color: "#333" },
  mistakeInfo: { fontSize: 13, color: "#666", marginTop: 4 },
});
