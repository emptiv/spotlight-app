import BaybayinKeyboard from "@/components/BaybayinKeyboard";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const gameStages = [
  { type: "text", content: "Are you ready?" },
  { type: "type", prompt: "Type 'bata'", correct: "ᜊᜆ" },
  { type: "type", prompt: "Type 'sulat'", correct: "ᜐᜓᜎᜆ᜔" },
  { type: "type", prompt: "Type 'aral'", correct: "ᜀᜇᜎ᜔" },
];

export default function TypingChallengeScreen() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [error, setError] = useState("");
  const [correctMessage, setCorrectMessage] = useState("");
  const router = useRouter();

  const current = gameStages[index];
  const isLast = index === gameStages.length - 1;

  const handleKeyPress = (char: string) => {
    setError("");
    setCorrectMessage("");
    if (char === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + char);
    }
  };

  const handleAction = () => {
    if (current.type === "type") {
      if (!isCorrect) {
        if (input === current.correct) {
          setIsCorrect(true);
          setCorrectMessage("Awesome! ✅");
        } else {
          setError("Try again.");
        }
        return;
      }

      // move forward
      if (isLast) {
        setShowFinished(true);
      } else {
        setIndex(index + 1);
        setInput("");
        setIsCorrect(false);
        setError("");
        setCorrectMessage("");
      }
    } else {
      if (isLast) {
        setShowFinished(true);
      } else {
        setIndex(index + 1);
      }
    }
  };

  if (showFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.lessonText}>🎉 You've completed the challenge!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {current.type === "text" ? (
            <Text style={styles.lessonText}>{current.content}</Text>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.promptText}>{current.prompt}</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputText}>{input || " "}</Text>
              </View>
              {error !== "" && <Text style={styles.errorText}>{error}</Text>}
              {correctMessage !== "" && (
                <Text style={styles.correctText}>{correctMessage}</Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAction}>
            <Text style={styles.buttonText}>
              {index === 0 && current.type === "text"
                ? "Start"
                : current.type === "type"
                ? isCorrect
                  ? isLast
                    ? "Finish"
                    : "Next"
                  : "Submit"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {current.type === "type" && (
          <BaybayinKeyboard onKeyPress={handleKeyPress} />
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
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  lessonText: {
    fontSize: 20,
    color: Colors.PRIMARY,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
  promptText: {
    fontSize: 18,
    marginVertical: 16,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
  inputText: {
    fontSize: 40,
    color: Colors.PRIMARY,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "outfit-bold",
  },
  inputBox: {
    minHeight: 70,
    minWidth: "80%",
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 10,
    fontFamily: "outfit",
  },
  correctText: {
    fontSize: 16,
    color: "green",
    marginTop: 10,
    fontFamily: "outfit",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
