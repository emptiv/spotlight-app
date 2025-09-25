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
    return <Text style={{ padding: 20 }}>Loading...</Text>;

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
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Analytics Dashboard</Text>

          {/* Most Completed Lessons */}
          <Text style={styles.sectionTitle}>Most Completed Lessons</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
              labels: lessonLabels.map((title: string) => {
                const chunks = title.length > 10 ? title.match(/.{1,10}/g) : [title];
                return chunks ? chunks.join("\n") : ""; // fallback
              }),
                datasets: [{ data: lessonCounts }],
              }}
              width={Math.max(screenWidth, lessonLabels.length * 100)}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0} // keep 0 since we split into lines
              style={styles.chart}
            />
          </ScrollView>


          {/* Average Quiz Scores */}
          <Text style={styles.sectionTitle}>Average Quiz Scores per Lesson (%)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{ labels: scoreLabels, datasets: [{ data: scoreData }] }}
              width={Math.max(screenWidth, scoreLabels.length * 100)}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </ScrollView>

          {/* Quiz Attempt Types */}
          <Text style={styles.sectionTitle}>Quiz Attempt Types Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />

          {/* Active Users */}
          <Text style={styles.sectionTitle}>Active Users</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Daily</Text>
              <Text style={styles.statValue}>{activeUsers.daily}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Weekly</Text>
              <Text style={styles.statValue}>{activeUsers.weekly}</Text>
            </View>
          </View>

          {/* Leaderboard Header */}
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
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#007AFF" },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#333" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  chart: { marginVertical: 8, borderRadius: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
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
  leaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 6,
  },
  leaderName: { fontSize: 16, fontWeight: "bold" },
  leaderXP: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
});
