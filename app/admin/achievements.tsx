import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

type Section =
  | { type: "header" }
  | { type: "badges"; data: { userId: string; name: string; badgeCount: number }[] }
  | {
      type: "frequency";
      data: {
        mostCommon: { badge: string; count: number } | null;
        leastCommon: { badge: string; count: number } | null;
        all: { badge: string; count: number }[];
      };
    }
  | { type: "streaks"; data: { userId: string; name: string; streakCount: number }[] };

export default function AchievementsScreen() {
  const badges = useQuery(api.adm_achievements.badgesPerUser);
  const frequency = useQuery(api.adm_achievements.achievementFrequency);
  const streaks = useQuery(api.adm_achievements.streakKeepers);

  if (!badges || !frequency || !streaks) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  const sections: Section[] = [
    { type: "header" },
    { type: "badges", data: badges },
    { type: "frequency", data: frequency },
    { type: "streaks", data: streaks },
  ];

  const renderItem = ({ item }: ListRenderItemInfo<Section>) => {
    switch (item.type) {
      case "header":
        return <Text style={styles.header}>Achievements & Engagement</Text>;

      case "badges":
        return (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Badges per User</Text>
            <FlatList
              data={item.data}
              keyExtractor={(u) => u.userId}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.user}>{item.name}</Text>
                  <Text style={styles.info}>Badges: {item.badgeCount}</Text>
                </View>
              )}
            />
          </View>
        );

      case "frequency":
        return (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Achievement Frequency</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Most Common</Text>
                <Text style={styles.statValue}>
                  {item.data.mostCommon
                    ? `${item.data.mostCommon.badge} (${item.data.mostCommon.count})`
                    : "-"}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Least Common</Text>
                <Text style={styles.statValue}>
                  {item.data.leastCommon
                    ? `${item.data.leastCommon.badge} (${item.data.leastCommon.count})`
                    : "-"}
                </Text>
              </View>
            </View>
            {item.data.all.map((row, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.user}>{row.badge}</Text>
                <Text style={styles.info}>Earned: {row.count}</Text>
              </View>
            ))}
          </View>
        );

      case "streaks":
        return (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Top Streak Keepers</Text>
            {item.data.map((s) => (
              <View key={s.userId} style={styles.row}>
                <Text style={styles.user}>{s.name}</Text>
                <Text style={styles.info}>🔥 {s.streakCount} day(s)</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <FlatList
      data={sections}
      keyExtractor={(_, idx) => idx.toString()}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#222",
  },

  card: {
    width: screenWidth * 0.6,
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

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
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
  statValue: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },

  row: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
  },
});
