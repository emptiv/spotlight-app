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
import FakeSpellingAndCards from "./FakeGames"; // the mini games screen

const { width } = Dimensions.get("window");

const miniGamesDialogue = [
  "Welcome to Mini Games!",
  "Need a break from lessons? This is the perfect spot to practice your skills.",
  "Here you can practice your spelling skills.",
  "Try offline flashcards to review characters anywhere.",
  "Have fun while learning—every game brings you one step closer to mastery!"
];

export default function TourMiniGamesWithOverlay() {
  const router = useRouter();
  const [currentLine, setCurrentLine] = useState(0);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );


  const handleNext = () => {
    if (currentLine < miniGamesDialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      router.replace("/tour/TourBoardO");
      setCurrentLine(0);
    }
  };

  useEffect(() => {
    // Highlight animation for flashcards
    if (currentLine === 2 || currentLine === 3) {
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
      {/* Render Mini Games UI underlay */}
      <FakeSpellingAndCards />

      {/* Full-screen dim */}
      <View style={styles.dim} />

      {/* Highlight Spelling Card */}
      {currentLine === 2 && (
        <Animated.View style={[styles.spellingHighlight, { opacity: highlightOpacity }]} />
      )}

      {/* Highlight Flashcards */}
      {currentLine === 3 && (
        <Animated.View style={[styles.flashcardHighlight, { opacity: highlightOpacity }]} />
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
            {miniGamesDialogue[currentLine]}
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
  spellingHighlight: {
    position: "absolute",
    top: 216, // approximate top of the spelling card
    left: 24,
    width: width - 48,
    height: 141,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
    zIndex: 20,
  },
  flashcardHighlight: {
    position: "absolute",
    top: 396, // approximate top of the flashcard
    left: 24,
    width: width - 48,
    height: 141,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
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
