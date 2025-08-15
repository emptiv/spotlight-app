import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface User {
  rank: number;
  name: string;
  totalXP: number;
}

export default function Leaderboard() {
  const { userId: clerkUserId } = useAuth();
  const router = useRouter();

  const dailyUsers = useQuery(api.community.getDailyLeaderboard, { limit: 10 }) || [];
  const weeklyUsers = useQuery(api.community.getWeeklyLeaderboard, { limit: 10 }) || [];

  const LeaderboardSection = ({
    title,
    users,
  }: {
    title: string;
    users: User[];
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {users.length > 0 ? (
          users.map((user, index) => (
            <View key={user.rank} style={styles.userRow}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.name}>{user.name || "Anonymous"}</Text>
              <Text style={styles.xp}>{user.totalXP || 0} XP</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noUsers}>No players yet.</Text>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Leaderboard</Text>

      <LeaderboardSection title="Daily Top Players" users={dailyUsers} />
      <LeaderboardSection title="Weekly Top Players" users={weeklyUsers} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 100,
    backgroundColor: Colors.WHITE,
  },
  pageTitle: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 24,
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
