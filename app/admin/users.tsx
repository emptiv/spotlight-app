import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const users = useQuery(api.adm_users.listUsers, { search });
  const stats = useQuery(api.adm_users.getUserStats);
  const deleteUser = useMutation(api.adm_users.deleteUser);
  const resetProgress = useMutation(api.adm_users.resetUserProgress);

  if (!users || !stats) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>User Management</Text>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeThisWeek}</Text>
          <Text style={styles.statLabel}>Active (7d)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.newSignups}</Text>
          <Text style={styles.statLabel}>New</Text>
        </View>
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="🔍 Search by email or name..."
        value={search}
        onChangeText={setSearch}
      />

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text
                style={styles.userEmail}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.email}
              </Text>
              <Text style={styles.userMeta}>XP: {item.totalXP ?? 0}</Text>
              <Text style={styles.userMeta}>
                Last Active:{" "}
                {item.lastActive
                  ? new Date(item.lastActive).toLocaleDateString()
                  : "—"}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.resetBtn]}
                onPress={() => resetProgress({ userId: item._id })}
              >
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => deleteUser({ userId: item._id })}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24, paddingHorizontal: 20, backgroundColor: "#f9f9f9" },
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },

  pageTitle: { fontSize: 28, fontWeight: "bold", color: "#007AFF", marginBottom: 20 },

  // --- Stats ---
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  statValue: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },
  statLabel: { fontSize: 13, color: "#666", marginTop: 4 },

  // --- Search ---
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },

  // --- Users ---
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  userInfo: { flex: 1, marginRight: 12 },
  userEmail: { fontSize: 16, fontWeight: "600", color: "#333" },
  userMeta: { fontSize: 13, color: "#666", marginTop: 2 },

  // --- Actions ---
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  resetBtn: { backgroundColor: "#a09f9f" },
  deleteBtn: { backgroundColor: "red" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});
