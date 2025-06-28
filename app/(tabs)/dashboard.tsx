import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BarChart,
  PieChart,
} from "react-native-chart-kit";
import { COLORS } from "../../constants/theme";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const { userId } = useAuth();

  const data = useQuery(
    api.get_dashboard_data.getUserDashboardData,
    userId ? { userId } : "skip"
  );

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  const {
    user,
    lessonProgress,
    characterStats,
    typeStats,
  } = data;

  const completedLessons = lessonProgress.filter((l) => l.isCompleted);
  const totalXP = user.totalXP ?? 0;

  const accuracyChartWidth = Math.max(screenWidth, characterStats.length * 70);

  const barChartData = {
    labels: characterStats.map((c) => c.label),
    datasets: [
      {
        data: characterStats.map((c) =>
          Math.round((c.correct / c.total) * 100)
        ),
        color: () => COLORS.primary,
      },
    ],
  };

  const makePieData = (typeKey: "mcq" | "writing") => {
    const stats = typeStats[typeKey];
    if (!stats) return null;
    const incorrect = stats.total - stats.correct;
    return [
      {
        name: "Correct",
        population: stats.correct,
        color: COLORS.primary,
      },
      {
        name: "Incorrect",
        population: incorrect,
        color: "#e57373",
      },
    ];
  };

  const mcqPieData = makePieData("mcq");
  const writingPieData = makePieData("writing");

  // Custom legend component for pie charts
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Info</Text>
        <Text>Name: {user.name || "N/A"}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Total XP: {totalXP}</Text>
        <Text>
          Last Active:{" "}
          {user.lastActive
            ? new Date(user.lastActive).toLocaleString()
            : "N/A"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>
        <Text>
          Lessons Completed: {completedLessons.length} / 6
        </Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${(completedLessons.length / 6) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Accuracy by Character */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Accuracy by Character</Text>
        {characterStats.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={{ paddingRight: 16 }}
          >
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
                  `${COLORS.primary}${Math.round(opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                labelColor: () => "#333",
                propsForLabels: {
                  fontFamily: "outfit-medium",
                },
              }}
              verticalLabelRotation={30}
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <Text>No character stats yet.</Text>
        )}
      </View>

      {/* MCQ Pie Chart Card */}
      {mcqPieData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Correct vs Incorrect: MCQ</Text>
          <PieChart
            data={mcqPieData}
            width={screenWidth - 64}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="30"
            chartConfig={{
              color: () => "#000",
              propsForLabels: {
                fontFamily: "outfit-medium",
              },
            }}
            absolute
            style={styles.chart}
          />
          <PieLegend data={mcqPieData} />
        </View>
      )}

      {/* Writing Pie Chart Card */}
      {writingPieData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Correct vs Incorrect: Writing</Text>
          <PieChart
            data={writingPieData}
            width={screenWidth - 64}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="30"
            chartConfig={{
              color: () => "#000",
              propsForLabels: {
                fontFamily: "outfit-medium",
              },
            }}
            absolute
            style={styles.chart}
          />
          <PieLegend data={writingPieData} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    color: COLORS.primary,
  },
  chart: {
    marginTop: 12,
    borderRadius: 12,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  legendColorBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontFamily: "outfit-medium",
    color: "#333",
    textAlign: "center",
  },
});
