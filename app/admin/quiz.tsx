import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function QuizMonitoring() {
  const recentQuizzes = useQuery(api.adm_quiz.recentQuizAttempts);
  const typingStats = useQuery(api.adm_quiz.typingChallengeStats);
  const commonMistakes = useQuery(api.adm_quiz.mostCommonMistakes);
  const hardestSymbols = useQuery(api.adm_quiz.hardestSymbolsByType);

  if (!recentQuizzes || !typingStats || !commonMistakes || !hardestSymbols)
    return <Text style={{ padding: 20 }}>Loading...</Text>;

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
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Quiz & Challenge Monitoring</Text>

          {/* Recent Quiz Attempts */}
          <Text style={styles.sectionTitle}>Recent Quiz Attempts</Text>
          <FlatList
            data={recentQuizzes}
            keyExtractor={(item) => item.attemptId}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, marginBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.quizCard}>
                <Text style={styles.user}>{item.userName}</Text>
                <Text style={styles.info}>{item.lessonTitle}</Text>
                <Text style={[styles.accuracy, { color: getAccuracyColor(Math.round((item.correctAnswers / item.totalQuestions) * 100)) }]}>
                  Accuracy: {Math.round((item.correctAnswers / item.totalQuestions) * 100)}%
                </Text>
                <Text style={[styles.stars, { color: getStarsColor(item.earnedStars) }]}>
                  ⭐ {item.earnedStars}
                </Text>
                <Text style={styles.date}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
          />

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
          <Text style={styles.sectionTitle}>Hardest Symbols by Type</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>MCQ</Text>
              <Text style={styles.statValue}>{hardestSymbols.mcq || "-"}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Writing</Text>
              <Text style={styles.statValue}>{hardestSymbols.writing || "-"}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Drag</Text>
              <Text style={styles.statValue}>{hardestSymbols.drag || "-"}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Most Common Mistakes</Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.user}>{item.symbol || "[blank]"}</Text>
          <Text style={styles.info}>Mistakes: {item.count}</Text>
        </View>
      )}
    />
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#333" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 8 },

  quizCard: {
    width: screenWidth * 0.7,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  user: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  info: { fontSize: 14, color: "#555", marginTop: 2 },
  accuracy: { fontSize: 14, marginTop: 4, fontWeight: "bold" },
  stars: { fontSize: 16, marginTop: 4, fontWeight: "bold" },
  date: { fontSize: 12, color: "#999", marginTop: 4 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statLabel: { fontSize: 14, color: "#777" },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },

  row: { padding: 12, backgroundColor: "#fff", borderRadius: 12, marginBottom: 8 },
});
