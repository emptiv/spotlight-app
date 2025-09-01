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
import FakeDashboard from "./FakeDashboard"; // the dashboard screen

const { width } = Dimensions.get("window");

const dashboardDialogue = [
  "Welcome to your Dashboard!",
  "Here you can see your profile, XP, and achievements.",
  "Check out these tabs to see a detailed view of your Achievements or Statistics!",
  "These are your badges. Collect them all!",
  "Track your progress here. Keep going to complete all lessons!",
];

export default function TourDashboardWithOverlay() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );

  const handleNext = () => {
    if (currentLine < dashboardDialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.replace("/tour/TourGamesO");
      setCurrentLine(0)
    }
  };

  useEffect(() => {
    // Highlight animation for badges step
    if (currentLine === 3) {
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
      {/* Render Dashboard UI underlay */}
      <FakeDashboard />

      {/* Full-screen dim */}
      <View style={styles.dim} />

      {/* Highlight profile card */}
      {currentLine === 1 && <View style={styles.profileHighlight} />}

      {/* Highlight tabs */}
      {currentLine === 2 && <View style={styles.tabsHighlight} />}

      {/* Highlight badges */}
      {currentLine === 3 && (
        <Animated.View style={[styles.badgeHighlight, { opacity: highlightOpacity }]} />
      )}

      {/* Highlight progress */}
      {currentLine === 4 && <View style={styles.progressHighlight} />}

      {/* Clickable overlay dialogue */}
      <TouchableOpacity
      style={[
        styles.overlay,
        currentLine === 4 ? { bottom: 220, zIndex: 30 } : {} // move higher for progress step
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
            {dashboardDialogue[currentLine]}
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
  profileHighlight: {
    position: "absolute",
    top: 170,
    left: 16,
    width: width - 32,
    height: 180,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
    zIndex: 20,
  },
  tabsHighlight: {
    position: "absolute",
    top: 363, // approximate position of tabs row
    left: 16,
    width: width - 32,
    height: 50,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
    zIndex: 20,
  },
  badgeHighlight: {
    position: "absolute",
    top: 420, // approximate position of badges container
    left: 16,
    width: width - 32,
    height: 150,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
    zIndex: 20,
  },
  progressHighlight: {
    position: "absolute",
    top: 600, // approximate position of progress card
    left: 16,
    width: width - 32,
    height: 150,
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
