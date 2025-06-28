// app/practice/[char].tsx
import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Write {character.symbol}</Text>
        <View style={{ width: 28 }} />
      </View>

      <HandwritingCanvas
        key={canvasKey}
        lesson={character.lesson}
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
        <Text style={[styles.feedback, { color: isCorrect ? Colors.SUCCESS : "#f00" }]}>
          {isCorrect ? "Correct!" : "Try again"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  feedback: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginTop: 16,
  },
});
