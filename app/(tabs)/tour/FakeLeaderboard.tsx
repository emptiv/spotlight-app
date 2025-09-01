import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function FakeLeaderboard() {
  // Fake users
  const dailyUsers = [
    { rank: 1, name: "Alice", totalXP: 120 },
    { rank: 2, name: "Bob", totalXP: 110 },
    { rank: 3, name: "Charlie", totalXP: 100 },
  ];

  const weeklyUsers = [
    { rank: 1, name: "Diana", totalXP: 540 },
    { rank: 2, name: "Evan", totalXP: 500 },
    { rank: 3, name: "Fiona", totalXP: 480 },
  ];

  const LeaderboardSection = ({ title, users }: { title: string; users: typeof dailyUsers }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {users.length > 0 ? (
          users.map((user, index) => (
            <View key={index} style={styles.userRow}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.xp}>{user.totalXP} XP</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noUsers}>No players yet.</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Fake Header */}
      <View style={styles.fakeHeader}>
        <Ionicons name="menu" size={28} color={Colors.BLACK} />
        <Text style={styles.fakeHeaderTitle}>Leaderboard</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="help-circle" size={30} color={Colors.BLACK} style={{ marginRight: 12 }} />
          <Ionicons name="chatbox-ellipses" size={26} color={Colors.BLACK} paddingTop={2.5} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Text style={[styles.sectionTitle, { fontSize: 32 }]}>Leaderboard</Text>
        <LeaderboardSection title="Daily Top Players" users={dailyUsers} />
        <LeaderboardSection title="Weekly Top Players" users={weeklyUsers} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fakeHeader: {
    height: 85,
    paddingTop: 25,
    backgroundColor: Colors.SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fakeHeaderTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.BLACK,
    flex: 1,
    textAlign: "center",
    marginLeft: -90, // offsets the menu icon width to center title properly
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  rank: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    width: 24,
  },
  name: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    flex: 1,
  },
  xp: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  noUsers: {
    fontFamily: "outfit-medium",
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    paddingVertical: 8,
  },
});
