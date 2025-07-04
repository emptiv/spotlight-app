import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

const IconTitle = ({ name, label }: { name: keyof typeof Ionicons.glyphMap; label: string }) => (
  <View style={styles.iconTitleRow}>
    <Ionicons name={name} size={18} color={COLORS.primary} style={styles.iconTitleIcon} />
    <Text style={styles.section}>{label}</Text>
  </View>
);

const InfoItem = ({ text }: { text: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name="ellipse" size={6} color="#666" style={styles.bullet} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const IconWithLabelButton = ({ iconName, label }: { iconName: keyof typeof Ionicons.glyphMap; label: string }) => (
  <View style={styles.iconButtonWrapper}>
    <Ionicons name={iconName} size={24} color="#555" />
    <Text style={styles.iconButtonLabel}>{label}</Text>
  </View>
);

export default function Help() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Help Guide</Text>
      </View>

      <View style={styles.card}>
        <IconTitle name="school" label="Lesson Map / Homepage" />
        <InfoItem text="Lesson Map: Visual guide for your progress" />
        <InfoItem text="Lesson Buttons:" />
        <View style={styles.lessonStatusRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, { backgroundColor: "#6bcf63" }]}>
              <Ionicons name="checkmark" size={14} color="white" />
            </View>
            <Text style={styles.statusLabel}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="book" size={14} color="white" />
            </View>
            <Text style={styles.statusLabel}>Unlocked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIcon, { backgroundColor: "#ccc" }]}>
              <Ionicons name="lock-closed" size={14} color="white" />
            </View>
            <Text style={styles.statusLabel}>Locked</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <IconTitle name="school" label="Lessons" />
        <Text style={styles.subsection}>Study Session</Text>
        <InfoItem text="Draw on canvas" />
        <Text style={styles.subSubsection}>Canvas Tools</Text>
        <View style={styles.iconRow}>
          <IconWithLabelButton iconName="trash" label="Clear" />
          <IconWithLabelButton iconName="eye" label="Guide" />
          <IconWithLabelButton iconName="volume-high" label="Audio" />
          <IconWithLabelButton iconName="checkmark-sharp" label="Submit" />
        </View>

        <Text style={styles.subsection}>Quiz</Text>
        <InfoItem text="MCQ: Match Baybayin character to Latin letter" />
        <InfoItem text="Writing: Draw the correct Baybayin character" />
      </View>

      <View style={styles.card}>
        <IconTitle name="flash" label="Practice Module" />
        <InfoItem text="View all Baybayin characters" />
        <InfoItem text="Tap and practice drawing any character" />
      </View>

      <View style={styles.card}>
        <IconTitle name="trophy" label="Dashboard" />
        <InfoItem text="See user info & XP" />
        <InfoItem text="Track accuracy for each character" />
        <View style={{ marginLeft: 16 }}>
          <InfoItem text="Correct vs Incorrect" />
          <InfoItem text="Separate for MCQ and Writing" />
        </View>
      </View>

      <View style={styles.card}>
        <IconTitle name="person" label="Me" />
        <InfoItem text="Press Edit Name to change your username" />
        <InfoItem text="Tap Sign Out to log out of your account" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24, // Adjusted from 100 to fix extra space
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
  title: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: COLORS.primary,
    marginBottom: 0,
  },
  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  iconTitleIcon: {
    marginRight: 6,
  },
  section: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: COLORS.primary,
  },
  subsection: {
    fontSize: 14,
    fontFamily: "outfit-bold",
    color: "#555",
    marginTop: 12,
    marginBottom: 4,
  },
  subSubsection: {
    fontSize: 13,
    fontFamily: "outfit-medium",
    color: "#888",
    marginTop: 6,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    marginTop: 6,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: "outfit",
    fontSize: 14,
    color: "#333",
  },
  lessonStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginTop: 6,
  },
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 13,
    fontFamily: "outfit",
    color: "#333",
  },
  iconRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
    marginBottom: 8,
  },
  iconButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
  },
  iconButtonLabel: {
    fontSize: 12,
    fontFamily: "outfit",
    color: "#555",
    marginTop: 2,
    textAlign: "center",
  },
});
