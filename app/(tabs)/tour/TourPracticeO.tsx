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
import PracticeUI from "./FakePractice"; // the stripped-down Practice screen

const { width } = Dimensions.get("window");

const practiceDialogue = [
  "Need more practice?",
  "Here you can focus on vowels and consonants.",
  "Use the buttons at the top to switch between Vowels and Consonants.",
  "You can pick the character you want to practice writing as many times as you want!",
];

export default function TourPracticeWithOverlay() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );

  const handleNext = () => {
    if (currentLine < practiceDialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.replace("/tour/TourDashboardO");
      setCurrentLine(0)
    }
  };

  useEffect(() => {
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
      {/* Render Practice UI underlay */}
      <PracticeUI />

      {/* Full-screen dim */}
      <View style={styles.dim} />

      {/* Highlight for toggle buttons */}
      {currentLine === 2 && (
        <Animated.View
          style={[
            styles.buttonHighlight,
            { opacity: highlightOpacity },
          ]}
        />
      )}

      {/* Clickable overlay dialogue */}
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
            source={require("@/assets/ming/default.png")} // <-- your cat image
            style={styles.catImage}
          />
          <Text style={styles.dialogueText}>{practiceDialogue[currentLine]}</Text>
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
  buttonHighlight: {
    position: "absolute",
    top: 205,
    left: 16,
    width: width - 32,
    height: 50,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
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
