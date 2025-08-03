import BaybayinKeyboard from "@/components/BaybayinKeyboard";
import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Word = { baybayin: string; latin: string; [key: string]: any };

export default function SpellingQuizScreen() {
  const [isSetup, setIsSetup] = useState(true);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [words, setWords] = useState<Word[]>([]);

  const fetchedWords = useQuery(
    api.getWords.getWords,
    !isSetup && difficulty && questionCount
      ? {
          difficulty,
          limit: questionCount,
        }
      : "skip"
  );

  useEffect(() => {
    if (fetchedWords) {
      setWords(fetchedWords);
    }
  }, [fetchedWords]);

  const handleKeyPress = (char: string) => {
    if (char === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + char);
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const currentWord = words[currentIndex];
    if (input === currentWord.baybayin) {
      setScore((s) => s + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 === words.length) {
      setShowFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setInput("");
      setIsCorrect(false);
      setHasSubmitted(false);
      setResetSignal((r) => r + 1);
    }
  };

  if (isSetup) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Quiz Settings</Text>

        <Text style={styles.label}>Difficulty</Text>
        {["easy", "medium", "hard"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.optionButton,
              difficulty === level && styles.selectedOption,
            ]}
            onPress={() => setDifficulty(level)}
          >
            <Text
              style={[
                styles.optionText,
                difficulty === level && { color: "white" },
              ]}
            >
              {level.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Number of Questions</Text>
        {[5, 10, 15].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.optionButton,
              questionCount === num && styles.selectedOption,
            ]}
            onPress={() => setQuestionCount(num)}
          >
            <Text
              style={[
                styles.optionText,
                questionCount === num && { color: "white" },
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.button,
            !(difficulty && questionCount) && { opacity: 0.5 },
          ]}
          disabled={!(difficulty && questionCount)}
          onPress={() => setIsSetup(false)}
        >
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!words || words.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontFamily: "outfit" }}>
          Loading quiz words...
        </Text>
      </View>
    );
  }

  if (showFinished) {
    const maxScore = words.length;
    const percentage = Math.round((score / maxScore) * 100);
    const stars = Math.round((percentage / 100) * 5);

    return (
      <View style={styles.centered}>
        <Text style={styles.title}>🎉 Finished!</Text>
        <Text style={styles.scoreText}>
          Your score: {score} / {maxScore}
        </Text>
        <Text style={styles.percentageText}>({percentage}%)</Text>
        <Text style={styles.starsText}>
          {"★".repeat(stars) + "☆".repeat(5 - stars)}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setIsSetup(true);
            setCurrentIndex(0);
            setInput("");
            setScore(0);
            setShowFinished(false);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = words[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>Type: {current.latin}</Text>
      <Text style={styles.input}>{input || " "}</Text>

      {hasSubmitted && isCorrect && (
        <Text style={styles.correct}>Correct! ✅</Text>
      )}
      {hasSubmitted && !isCorrect && (
        <Text style={styles.error}>Try again.</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={isCorrect ? handleNext : handleSubmit}
      >
        <Text style={styles.buttonText}>
          {isCorrect ? "Next" : "Submit"}
        </Text>
      </TouchableOpacity>

      <BaybayinKeyboard onKeyPress={handleKeyPress} resetSignal={resetSignal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.WHITE },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.PRIMARY,
  },
  prompt: { fontSize: 20, fontFamily: "outfit-bold", marginBottom: 20 },
  input: {
    fontSize: 40,
    borderBottomWidth: 2,
    borderColor: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "outfit-bold",
  },
  correct: { color: "green", fontSize: 16 },
  error: { color: "red", fontSize: 16 },
  scoreText: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    marginVertical: 10,
    color: Colors.PRIMARY,
  },
  percentageText: {
    fontSize: 18,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  starsText: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.PRIMARY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  label: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    marginVertical: 6,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.PRIMARY,
  },
  optionText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
});
