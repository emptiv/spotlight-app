// app/practice/[char].tsx
import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CHAR_MAP = {
  a:    { symbol: "ᜀ", answer: "a",    lesson: "lesson1" },
  e_i:  { symbol: "ᜁ", answer: "e_i",  lesson: "lesson1" },
  o_u:  { symbol: "ᜂ", answer: "o_u",  lesson: "lesson1" },

  pa:   { symbol: "ᜉ", answer: "pa",   lesson: "lessonx" },
  ka:   { symbol: "ᜃ", answer: "ka",   lesson: "lesson2" },
  na:   { symbol: "ᜈ", answer: "na",   lesson: "lesson2" },

  ha:   { symbol: "ᜑ", answer: "ha",   lesson: "lesson3" },
  ba:   { symbol: "ᜊ", answer: "ba",   lesson: "lesson3" },
  ga:   { symbol: "ᜄ", answer: "ga",   lesson: "lesson3" },

  sa:   { symbol: "ᜐ", answer: "sa",   lesson: "lesson4" },
  da_ra:{ symbol: "ᜇ", answer: "da_ra",lesson: "lesson4" },
  ta:   { symbol: "ᜆ", answer: "ta",   lesson: "lesson4" },

  nga:  { symbol: "ᜅ", answer: "nga",  lesson: "lesson5" },
  wa:   { symbol: "ᜏ", answer: "wa",   lesson: "lesson5" },
  la:   { symbol: "ᜎ", answer: "la",   lesson: "lesson5" },

  ma:   { symbol: "ᜋ", answer: "ma",   lesson: "lesson6" },
  ya:   { symbol: "ᜌ", answer: "ya",   lesson: "lesson6" },
};

export default function CharacterPractice() {
  const { char } = useLocalSearchParams();
  const router = useRouter();

  const character = CHAR_MAP[char as keyof typeof CHAR_MAP];
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  if (!character) return <Text>Invalid character</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          await playSound('click');
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Write {character.symbol}</Text>

        <HandwritingCanvas
          key={canvasKey}
          lesson={character.lesson}
          character={character.answer}
          onPrediction={(result) => {
            const isMatch = result.toLowerCase() === character.answer;
            setPrediction(result);
            setIsCorrect(isMatch);

            if (isMatch) {
              setTimeout(() => {
                setPrediction(null);
                setIsCorrect(false);
                setCanvasKey((prev) => prev + 1); // force reset
              }, 1000);
            }
          }}
          onClear={() => {
            setPrediction(null);
            setIsCorrect(false);
          }}
        />

        {prediction && (
          <Text style={[
            styles.feedback,
            { color: isCorrect ? Colors.SUCCESS : "#f00" }
          ]}>
            {isCorrect ? "Correct!" : "Try again"}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginBottom: 24,
    color: Colors.PRIMARY,
    textAlign: "center",
  },
  feedback: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginTop: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
