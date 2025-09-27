import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  // --- Queries ---
  const lessonsCompleted = useQuery(api.adm_analytics.lessonsCompleted);
  const avgScoresPerLesson = useQuery(api.adm_analytics.averageQuizScoresPerLesson);
  const attemptTypes = useQuery(api.adm_analytics.userAttemptTypeDistribution);
  const activeUsers = useQuery(api.adm_analytics.activeUsers);
  const xpLeaderboard = useQuery(api.adm_analytics.xpLeaderboard);

  if (
    !lessonsCompleted ||
    !avgScoresPerLesson ||
    !attemptTypes ||
    !activeUsers ||
    !xpLeaderboard
  )
    return (
      <View style={styles.center}>
        <Text>Loading analytics...</Text>
      </View>
    );

  // --- Prepare Charts ---
  const lessonLabels = lessonsCompleted.map((l: any) => l.title);
  const lessonCounts = lessonsCompleted.map((l: any) => l.count);

  const scoreLabels = avgScoresPerLesson.map((l: any) => l.title);
  const scoreData = avgScoresPerLesson.map((l: any) => l.averageScore);

  const pieData = [
    { name: "MCQ", count: attemptTypes.mcq, color: "#4caf50", legendFontColor: "#333", legendFontSize: 12 },
    { name: "Writing", count: attemptTypes.writing, color: "#ff9800", legendFontColor: "#333", legendFontSize: 12 },
    { name: "Drag", count: attemptTypes.drag, color: "#f44336", legendFontColor: "#333", legendFontSize: 12 },
  ];

  return (
    <FlatList
      data={xpLeaderboard}
      keyExtractor={(item) => item.userId}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.pageTitle}>Analytics Dashboard</Text>

          {/* --- Most Completed Lessons --- */}
          <Text style={styles.sectionTitle}>Most Completed Lessons</Text>
          <View style={styles.card}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={{
                  labels: lessonLabels.map((title: string) => {
                    const chunks = title.length > 10 ? title.match(/.{1,10}/g) : [title];
                    return chunks ? chunks.join("\n") : "";
                  }),
                  datasets: [{ data: lessonCounts }],
                }}
                width={Math.max(screenWidth, lessonLabels.length * 100)}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                style={styles.chart}
              />
            </ScrollView>
          </View>

          {/* --- Average Quiz Scores --- */}
          <Text style={styles.sectionTitle}>Average Quiz Scores per Lesson (%)</Text>
          <View style={styles.card}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{ labels: scoreLabels, datasets: [{ data: scoreData }] }}
                width={Math.max(screenWidth, scoreLabels.length * 100)}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </ScrollView>
          </View>

          {/* --- Quiz Attempt Types --- */}
          <Text style={styles.sectionTitle}>Quiz Attempt Types Distribution</Text>
          <View style={styles.card}>
            <PieChart
              data={pieData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>

          {/* --- Active Users --- */}
          <Text style={styles.sectionTitle}>Active Users</Text>
          <View style={styles.cardRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Daily</Text>
              <Text style={styles.statValue}>{activeUsers.daily}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Weekly</Text>
              <Text style={styles.statValue}>{activeUsers.weekly}</Text>
            </View>
          </View>

          {/* --- Leaderboard --- */}
          <Text style={styles.sectionTitle}>Top 10 Learners (XP)</Text>
        </>
      }
      renderItem={({ item, index }) => (
        <View style={styles.leaderRow}>
          <Text style={styles.leaderName}>#{index + 1} {item.name}</Text>
          <Text style={styles.leaderXP}>{item.totalXP} XP</Text>
        </View>
      )}
    />
  );
}

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  style: { borderRadius: 12 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
};

const styles = StyleSheet.create({
  container: { paddingTop: 20, padding: 24, paddingBottom: 100, backgroundColor: "#f9f9f9" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  pageTitle: { fontSize: 32, fontWeight: "bold", color: "#007AFF", marginBottom: 24 },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#007AFF", marginBottom: 12, marginTop: 16 },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },

  // Stats
  statCard: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  statLabel: { fontSize: 14, color: "#555" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },

  // Charts
  chart: { marginTop: 12, borderRadius: 12 },

  // Leaderboard
  leaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 6,
  },
  leaderName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  leaderXP: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
});
