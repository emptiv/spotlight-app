import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";

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
    };

export default function AchievementsScreen() {
  const badges = useQuery(api.adm_achievements.badgesPerUser);
  const frequency = useQuery(api.adm_achievements.achievementFrequency);

  if (!badges || !frequency) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  // Sort users by badgeCount descending
  const sortedBadges = [...badges].sort((a, b) => b.badgeCount - a.badgeCount);

  const sections: Section[] = [
    { type: "header" },
    { type: "badges", data: sortedBadges },
    { type: "frequency", data: frequency },
  ];

  const renderItem = ({ item }: { item: Section }) => {
    switch (item.type) {
      case "header":
        return <Text style={styles.pageTitle}>Achievements</Text>;

      case "badges":
        return (
          <>
            <Text style={styles.sectionTitle}>Badges per User</Text>
            {item.data.map((user) => (
              <View key={user.userId} style={styles.userCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.user}>{user.name}</Text>
                  <Text style={styles.info}>Badges Earned: {user.badgeCount}</Text>
                </View>
                <View style={styles.badgeCountContainer}>
                  <Text style={styles.badgeCount}>{user.badgeCount}</Text>
                </View>
              </View>
            ))}
          </>
        );

      case "frequency":
        return (
          <>
            <Text style={styles.sectionTitle}>Achievement Frequency</Text>

            {/* Most/Least Common */}
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

            {/* All badges */}
          <FlatList
            data={item.data.all}
            keyExtractor={(row, idx) => `${row.badge}-${idx}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.horizontalCard}>
                <Text style={styles.user}>{item.badge}</Text>
                <Text style={styles.info}>Earned: {item.count}</Text>
              </View>
            )}
          />

          </>
        );

      default:
        return null;
    }
  };

  return (
    <FlatList
      data={sections}
      keyExtractor={(_, idx) => idx.toString()}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
    />
  );
}

const styles = StyleSheet.create({
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },

  pageTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#007AFF" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#444" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
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
  statValue: { fontSize: 18, fontWeight: "bold", color: "#007AFF", textAlign: "center" },

  // User Cards
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: "100%", // full width so nothing is cut
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  user: { fontSize: 16, fontWeight: "600", color: "#333" },
  info: { fontSize: 14, color: "#666", marginTop: 4 },

  badgeCountContainer: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCount: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  card: {
    width: screenWidth * 0.65,
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
  horizontalCard: {
    width: screenWidth * 0.6,  // adjust as needed
    height: 100,               // ensures full vertical space
    marginHorizontal: 6,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
  },
});
