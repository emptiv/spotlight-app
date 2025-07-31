import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ChallengeIntroProps = {
  title: string;
  description?: string;
  bestScore?: number;
  bestStars?: number;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
};

export default function ChallengeIntro({
  title,
  description = "You can practice first or jump straight into the challenge.",
  bestScore = 0,
  bestStars = 0,
  onPrimaryPress,
  onSecondaryPress,
  primaryLabel = "Practice",
  secondaryLabel = "Start Game",
}: ChallengeIntroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.statsBox}>
        <View style={styles.row}>
          {[...Array(3)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < bestStars ? "star" : "star-outline"}
              size={48}
              color={Colors.PRIMARY}
            />
          ))}
        </View>
        <Text style={styles.scoreText}>Best Score: {bestScore}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{description}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await playSound("click");
            onPrimaryPress();
          }}
        >
          <Text style={styles.buttonText}>{primaryLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await playSound("click");
            onSecondaryPress();
          }}
        >
          <Text style={styles.buttonText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 16,
  },
  statsBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  scoreText: {
    marginTop: 12,
    fontSize: 18,
    color: "#444",
    fontFamily: "outfit-bold",
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "outfit",
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
