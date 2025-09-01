// tourScreens/TourHomeWithOverlay.tsx
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
import Colors from "../../../constants/Colors";
import TourHome from "./FakeHome"; // your fake home

const { width } = Dimensions.get("window");

// 🔹 Dialogue script for home tour
const homeDialogue = [
  "Welcome to Plumatika!",
  "To navigate between screens, you can open the menu from the top-left corner!", // highlight step
  "But first, this is your Home page.",
  "From here you can explore Lessons, Practice, or Mini Games.",
  "Let’s start with Lessons!",
];

export default function TourHomeWithOverlay() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );

  const handleNext = () => {
    if (currentLine < homeDialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.replace("/tour/TourMapO");
      setCurrentLine(0);
    }
  };

  // Animate menu highlight when that step is active
  useEffect(() => {
    if (currentLine === 1) {
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
      {/* Render fake home underlay */}
      <TourHome />

      {/* Full-screen dim */}
      <View style={styles.dim} />

      {/* Highlight for menu button */}
      {currentLine === 1 && (
        <Animated.View
          style={[
            styles.menuHighlight,
            { opacity: highlightOpacity },
          ]}
        />
      )}

      {/* Clickable overlay content */}
      <TouchableOpacity
        style={styles.overlay}
                  onPress={async () => {
                    await playSound('click');
                    handleNext();
                  }}
        activeOpacity={0.8}
      >
        <View style={styles.dialogueBox}>
          <Image
            source={require("@/assets/ming/default.png")}
            style={styles.mingImage}
          />
          <Text style={styles.dialogueText}>{homeDialogue[currentLine]}</Text>
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
  menuHighlight: {
    position: "absolute",
    top: 30,    // adjust vertical position manually
    left: 5,   // adjust horizontal position manually
    width: 50,  // adjust width manually
    height: 50, // adjust height manually
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255, 255, 255, 0.5)", // semi-transparent overlay
    borderRadius: 8,
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
    marginLeft: 10, // spacing between Ming and text
  },
  mingImage: {
    width: 80,
    height: 80,
    marginLeft: -10,
    borderRadius: 20,
  },
});
