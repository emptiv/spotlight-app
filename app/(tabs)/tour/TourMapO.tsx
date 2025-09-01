// tourScreens/TourFakeMapWithOverlay.tsx
import { playSound } from '@/constants/playClickSound';
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../constants/Colors";
import FakeMap from "./FakeMap"; // the stripped-down UI map

const { width } = Dimensions.get("window");

// 🔹 Dialogue script for map tour
const mapDialogue = [
  "Welcome to your Lessons map!",
  "Each tile represents a lesson you can unlock.",
  "Green tiles are completed, orange are unlocked, and grey are locked.",
  "Follow the path to complete lessons in order.",
  "Remember, you can only take the next lesson if you pass the quiz in the previous one."
];

export default function TourFakeMapWithOverlay() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );

  const handleNext = () => {
    if (currentLine < mapDialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.replace("/tour/TourPracticeO");
      setCurrentLine(0)
    }
  };

  // Optional pulsing highlight (if highlighting a specific node)
  useEffect(() => {
    if (currentLine === 1 || currentLine === 2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(highlightAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
          Animated.timing(highlightAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
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
      {/* Render FakeMap UI underneath */}
      <FakeMap />

      {/* Full-screen dim */}
      <View style={styles.dim} />

      {/* Example highlight (optional) */}
      {currentLine === 1 && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 373, // manually adjust to highlight a node
              left: 100, // manually adjust
              width: 100,
              height: 100,
              borderWidth: 2,
              borderColor: Colors.PRIMARY,
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 12,
              zIndex: 20,
              opacity: highlightOpacity,
            },
          ]}
        />
      )}

      {currentLine === 2 && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 373, // manually adjust to highlight a node
              left: 100, // manually adjust
              width: 100,
              height: 100,
              borderWidth: 2,
              borderColor: Colors.PRIMARY,
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 12,
              zIndex: 20,
              opacity: highlightOpacity,
            },
          ]}
        />
      )}

      {/* Clickable overlay content */}
      <TouchableOpacity style={styles.overlay} 
                  onPress={async () => {
                    await playSound('click');
                    handleNext();
                  }}
      activeOpacity={0.8}>
        <View style={styles.dialogueBox}>
          <Image source={require("@/assets/ming/default.png")} style={styles.mingImage} />
          <Text style={styles.dialogueText}>{mapDialogue[currentLine]}</Text>
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
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    width: width - 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  dialogueText: {
    fontSize: 18,
    color: Colors.PRIMARY,
    textAlign: "left",
    fontFamily: "outfit",
    flex: 1,
    marginLeft: 10,
  },
  mingImage: {
    width: 80,
    height: 80,
    marginLeft: -10,
    borderRadius: 20,
  },
});
