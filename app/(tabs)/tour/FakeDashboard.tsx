import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function FakeDashboard() {
  const [name, setName] = useState("Player");
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // Fake data
  const user = { email: "player@example.com", lastActive: new Date() };
  const totalXP = 120;
  const completedLessons = [1];
  const achievements = ["challenger", "perfectionist"];

  const badgeImages: Record<string, any> = {
    challenger: require('@/assets/badges/challenger.png'),
    perfectionist: require('@/assets/badges/perfectionist.png'),
    'su-su-supernova': require('@/assets/badges/supernova.png'),
  };

  const handleSave = () => {
    setFeedbackText("Name updated!");
    setTimeout(() => {
      setFeedbackText("");
      setModalVisible(false);
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Fake Header */}
      <View style={styles.fakeHeader}>
        <Ionicons name="menu" size={28} color={Colors.BLACK} />
        <Text style={styles.fakeHeaderTitle}>Home</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="help-circle" size={30} color={Colors.BLACK} style={{ marginRight: 12 }} />
          <Ionicons name="chatbox-ellipses" size={26} color={Colors.BLACK} paddingTop={2.5} />
        </View>
      </View>

      {/* Inner Content */}
      <View style={styles.contentWrapper}>
        {/* Dashboard Title */}
        <Text style={styles.title}>{name}'s Dashboard</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{name}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 8 }}>
                  <Ionicons name="pencil" size={20} color={Colors.BLACK} />
                </TouchableOpacity>
              </View>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
          </View>


          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total XP</Text>
              <Text style={styles.statValue}>{totalXP}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Last Active</Text>
              <Text style={styles.statValue}>{user.lastActive.toLocaleDateString()}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Achievements</Text>
              <Text style={styles.statValue}>{achievements.length}</Text>
            </View>
          </View>
        </View>

          {/* Tabs */}
          <View style={styles.tabSelector}>
            <TouchableOpacity style={styles.reButton}>
              <Text style={styles.reButtonText}>Achievements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reButton}>
              <Text style={styles.reButtonText}>Statistics</Text>
            </TouchableOpacity>
          </View>
          
        {/* Badges */}
        <View style={styles.badgesCard}>
          <Text style={styles.cardTitle}>Badges</Text>
          <View style={styles.badgesContainer}>
            {achievements.map((badgeName) => (
              <View key={badgeName} style={styles.badgeWrapper}>
                <Image
                  source={badgeImages[badgeName]}
                  style={styles.badgeImage}
                />
                <Text style={styles.badgeLabel}>{badgeName}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressTitleText}>🚀 Keep Going!</Text>
            <Text style={styles.progressBigNumber}>14%</Text>
          </View>
          <Text style={styles.progressSubText}>1 of 7 lessons completed</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${(1 / 7) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
            />
            {feedbackText ? <Text style={styles.feedbackText}>{feedbackText}</Text> : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: Colors.WHITE,
    flexGrow: 1,
  },
  contentWrapper: {
    padding: 16,
  },
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
    paddingRight: 150,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginTop: 10,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    marginRight: 16,
  },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  name: { fontSize: 20, fontFamily: "outfit-bold", color: "#222" },
  emailText: { fontSize: 14, color: "#555", fontFamily: "outfit" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 12, color: "#777", fontFamily: "outfit" },
  statValue: { fontSize: 16, fontFamily: "outfit-bold", color: Colors.PRIMARY, marginTop: 2 },
  badgesCard: { backgroundColor: "#fff", borderRadius: 12, padding: 10, marginBottom: 10 },
  badgesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 },
  badgeWrapper: { alignItems: "center", width: 80, height: 100, marginBottom: 16 },
  badgeImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: Colors.PRIMARY, marginBottom: 4 },
  badgeLabel: { fontFamily: "outfit", fontSize: 12, color: "#555", textAlign: "center", textTransform: "capitalize" },
  cardTitle: { fontSize: 20, fontFamily: "outfit-bold", marginBottom: 5, color: Colors.PRIMARY },
  progressTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  progressTitleText: { fontFamily: "outfit-bold", fontSize: 16, color: Colors.PRIMARY },
  progressBigNumber: { fontFamily: "outfit-bold", fontSize: 20, color: Colors.PRIMARY },
  progressSubText: { fontFamily: "outfit", fontSize: 13, color: "#555", marginBottom: 6 },
  progressBarBackground: { height: 8, backgroundColor: "#eee", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 4, backgroundColor: Colors.PRIMARY },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontFamily: "outfit-bold", marginBottom: 12, color: Colors.PRIMARY },
  nameInput: { width: "100%", height: 44, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, marginBottom: 12, fontFamily: "outfit", color: Colors.BLACK },
  feedbackText: { fontSize: 14, color: Colors.PRIMARY, fontFamily: "outfit-bold", marginBottom: 12, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: { backgroundColor: Colors.PRIMARY, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveButtonText: { color: Colors.WHITE, fontFamily: "outfit-bold" },
  cancelButton: { backgroundColor: "#ccc", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelButtonText: { color: Colors.BLACK, fontFamily: "outfit-bold" },
tabSelector: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginVertical: 13,
},
reButton: {
  paddingVertical: 8,
  paddingHorizontal: 14,
  margin: 4,
  borderRadius: 20,
  backgroundColor: Colors.SECONDARY,
  width: 125,
},
reButtonText: {
  fontFamily: "outfit",
  fontSize: 14,
  color: Colors.BLACK,
  textAlign: "center",
},

});
