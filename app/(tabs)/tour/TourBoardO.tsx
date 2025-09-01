import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FakeLeaderboard from "./FakeLeaderboard"; // the leaderboard screen

const { width } = Dimensions.get("window");

const leaderboardDialogue = [
  "Welcome to the Leaderboard!",
  "Here you can see the Daily Top Players.",
  "Check out the Weekly Top Players to see who is leading this week.",
  "Keep going—you could be the next top player!"
];

export default function TourLeaderboardWithOverlay() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );

  const handleNext = () => {
    if (currentLine < leaderboardDialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.replace("../../ming2");
      setCurrentLine(0)
    }
  };

  useEffect(() => {
    // Example: could animate weekly highlight if needed
    if (currentLine === 2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(highlightAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(highlightAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      highlightAnim.setValue(0);
    }
  }, [currentLine]);

  const highlightOpacity = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Render Leaderboard UI underlay */}
      <FakeLeaderboard />

      {/* Full-screen dim */}
      <View style={styles.dim} />

      {/* Highlight Daily Top Players */}
      {currentLine === 1 && <View style={styles.dailyHighlight} />}

      {/* Highlight Weekly Top Players */}
      {currentLine === 2 && (
        <Animated.View style={[styles.weeklyHighlight, { opacity: highlightOpacity }]} />
      )}

      {/* Clickable overlay dialogue */}
      <TouchableOpacity
        style={[
          styles.overlay,
        ]}
                  onPress={async () => {
                    await playSound('click');
                    handleNext();
                  }}
        activeOpacity={0.8}
      >
        <View style={styles.dialogueBox}>
          <Image
            source={require("@/assets/ming/default.png")}
            style={styles.catImage}
          />
          <Text style={styles.dialogueText}>
            {leaderboardDialogue[currentLine]}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dailyHighlight: {
    position: "absolute",
    top: 206, // approximate position of Daily Top Players card
    left: 24,
    width: width - 48,
    height: 152,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
    zIndex: 20,
  },
  weeklyHighlight: {
    position: "absolute",
    top: 417, // approximate position of Weekly Top Players card
    left: 24,
    width: width - 48,
    height: 152,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
    zIndex: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 10,
  },
  dialogueBox: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: width - 40,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  catImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 15,
  },
  dialogueText: {
    fontSize: 18,
    color: Colors.PRIMARY,
    textAlign: "left",
    fontFamily: "outfit",
    flex: 1,
  },
});
