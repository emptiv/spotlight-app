import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from 'convex/react';
import { useRouter } from "expo-router";
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const { userId: clerkUserId } = useAuth();
  const router = useRouter();

  // Profile data
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  );
  const userRecord = useQuery(
    api.users.getUserById,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  // Dashboard data
  const data = useQuery(
    api.get_dashboard_data.getUserDashboardData,
    clerkUserId ? { userId: clerkUserId } : "skip"
  );

  if (!data || !userRecord) {
    return (
      <View style={styles.center}>
        <Text>Loading statistics...</Text>
      </View>
    );
  }

  const { user, lessonProgress, characterStats, typeStats, totalXP } = data;
  const completedLessons = lessonProgress.filter((l) => l.isCompleted);
  const accuracyChartWidth = Math.max(screenWidth, characterStats.length * 70);

  const barChartData = {
    labels: characterStats.map((c) => c.label),
    datasets: [
      {
        data: characterStats.map((c) =>
          Math.round((c.correct / c.total) * 100)
        ),
        color: () => Colors.PRIMARY,
      },
    ],
  };

  const makePieData = (typeKey: "mcq" | "writing" | "drag") => {
    const stats = typeStats[typeKey];
    if (!stats) return null;
    const incorrect = stats.total - stats.correct;
    return [
      { name: "Correct", population: stats.correct, color: Colors.PRIMARY },
      { name: "Incorrect", population: incorrect, color: "#e57373" },
    ];
  };

  const mcqPieData = makePieData("mcq");
  const writingPieData = makePieData("writing");
  const dragPieData = makePieData("drag");

  function PieLegend({ data }: { data: typeof mcqPieData | null }) {
    if (!data) return null;
    const total = data.reduce((acc, cur) => acc + cur.population, 0);
    return (
      <View style={styles.legendContainer}>
        {data.map((slice, i) => (
          <View key={i} style={styles.legendItem}>
            <View
              style={[styles.legendColorBox, { backgroundColor: slice.color }]}
            />
            <Text style={styles.legendText}>
              {slice.name}
              {"\n"}
              <Text style={{ fontWeight: "bold" }}>
                {total > 0
                  ? `${Math.round((slice.population / total) * 100)}%`
                  : "0%"}
              </Text>
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
      onPress={async () => {
        await playSound('click');
        router.back();
      }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Statistics</Text>

      {/* --- Overview Stats --- */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total XP</Text>
          <Text style={styles.statValue}>{totalXP}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Lessons Completed</Text>
          <Text style={styles.statValue}>{completedLessons.length}/7</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average Accuracy</Text>
          <Text style={styles.statValue}>
            {characterStats.length > 0
              ? `${Math.round(characterStats.reduce((sum, c) => sum + (c.correct / c.total), 0) / characterStats.length * 100)}%`
              : "0%"}
          </Text>
        </View>
      </ScrollView>

      {/* --- Accuracy by Character --- */}
      <Text style={styles.sectionTitle}>Accuracy by Character</Text>
      <View style={styles.card}>
        {characterStats.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ paddingRight: 16 }}>
            <BarChart
              data={barChartData}
              width={accuracyChartWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix="%"
              fromZero
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#f9f9f9",
                backgroundGradientTo: "#f9f9f9",
                decimalPlaces: 0,
                color: (opacity = 1) =>
                  `${Colors.PRIMARY}${Math.round(opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                labelColor: () => "#333",
                propsForLabels: { fontFamily: "outfit-medium" },
              }}
              verticalLabelRotation={30}
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <Text>No character stats yet.</Text>
        )}
      </View>

      {/* --- Question Type Performance --- */}
      <Text style={styles.sectionTitle}>Question Type Performance</Text>
      {mcqPieData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MCQ</Text>
          <PieChart
            data={mcqPieData}
            width={screenWidth - 64}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="30"
            chartConfig={{ color: () => "#000" }}
            absolute
            style={styles.chart}
          />
          <PieLegend data={mcqPieData} />
        </View>
      )}
      {writingPieData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Writing</Text>
          <PieChart
            data={writingPieData}
            width={screenWidth - 64}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="30"
            chartConfig={{ color: () => "#000" }}
            absolute
            style={styles.chart}
          />
          <PieLegend data={writingPieData} />
        </View>
      )}
      {dragPieData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Drag & Drop</Text>
          <PieChart
            data={dragPieData}
            width={screenWidth - 64}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="30"
            chartConfig={{ color: () => "#000" }}
            absolute
            style={styles.chart}
          />
          <PieLegend data={dragPieData} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 70, padding: 24, paddingBottom: 100, backgroundColor: Colors.WHITE },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  pageTitle: { fontSize: 32, fontFamily: "outfit-bold", color: Colors.PRIMARY, marginBottom: 24 },

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

  sectionTitle: { fontSize: 20, fontFamily: "outfit-bold", color: Colors.PRIMARY, marginBottom: 12, marginTop: 16 },

  // Overview Stats
  statCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  statLabel: { fontFamily: "outfit-medium", color: "#555", fontSize: 14, marginBottom: 4 },
  statValue: { fontFamily: "outfit-bold", fontSize: 20, color: Colors.PRIMARY },

  // Cards
  card: { 
    backgroundColor: "#f9f9f9", 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    shadowColor: "#000", 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowRadius: 3, 
    elevation: 2 
  },
  cardTitle: { fontSize: 16, fontFamily: "outfit-bold", marginBottom: 8, color: Colors.PRIMARY },

  // Charts
  chart: { marginTop: 12, borderRadius: 12 },
  legendContainer: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 16 },
  legendColorBox: { width: 18, height: 18, borderRadius: 4, marginRight: 8 },
  legendText: { fontFamily: "outfit-medium", color: "#333", textAlign: "center" },
});
