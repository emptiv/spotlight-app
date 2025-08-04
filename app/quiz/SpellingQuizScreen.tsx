// imports
import BaybayinKeyboard from "@/components/BaybayinKeyboard";
import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";



// types
type Word = { baybayin: string; latin: string; [key: string]: any };
type Difficulty = "easy" | "medium" | "hard";

// points per difficulty
const basePointsMap: Record<Difficulty, { points: number; time: number }> = {
  easy: { points: 10, time: 20 },
  medium: { points: 20, time: 30 },
  hard: { points: 30, time: 40 },
};

// star rating logic
function getStarRating(score: number, maxScore: number): number {
  if (score <= 0) return 0;
  const percentage = (score / maxScore) * 100;

  if (percentage === 100) return 3;
  if (percentage >= 75) return 2;
  return 1;
}


export default function SpellingQuizScreen() {
  const router = useRouter();

  const { user } = useUser();

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: user?.id || "",
  });

  const [answers, setAnswers] = useState<any[]>([]);
  const [isSetup, setIsSetup] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [words, setWords] = useState<Word[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [seed] = useState(() => Math.random()); // ← will change on each mount

  const fetchedWords = useQuery(
    api.getWords.getWords,
    !isSetup && difficulty && questionCount
      ? { difficulty, limit: questionCount, seed }
      : "skip"
  );

  useEffect(() => {
    if (fetchedWords) {
      console.log("📦 Fetched words count:", fetchedWords.length);
      const shuffled = [...fetchedWords].sort(() => Math.random() - 0.5);
      setWords(shuffled);
    }
  }, [fetchedWords]);

  useEffect(() => {
    if (!isSetup && difficulty && words.length > 0) {
      startTimer();
    }
    return () => clearInterval(timerRef.current!);
  }, [currentIndex, words]);

  const startTimer = () => {
    clearInterval(timerRef.current!);
    const limit = basePointsMap[difficulty!].time;
    setTimeLeft(limit);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calculateSpeedBonus = (timeUsed: number) => {
    const total = basePointsMap[difficulty!].time;
    const ratio = (total - timeUsed) / total;
    if (ratio > 0.75) return 0.5;
    if (ratio > 0.5) return 0.25;
    if (ratio > 0.25) return 0.1;
    return 0;
  };

  const calculateStreakBonus = () => {
    if (streak + 1 === 3) return 10;
    if (streak + 1 === 5) return 20;
    if (streak + 1 === 10) return 50;
    return 0;
  };

  const handleKeyPress = (char: string) => {
    if (char === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + char);
    }
  };

  const handleSubmit = (isTimeout = false) => {
    setHasSubmitted(true);
    const currentWord = words[currentIndex];
    console.log("👉 Answer submitted:", input);
    console.log("✅ Correct Baybayin:", currentWord.baybayin);
    const correct = input === currentWord.baybayin;
    const timeUsed = basePointsMap[difficulty!].time - timeLeft;
    console.log("⏱️ Time used:", timeUsed, "seconds");
    console.log("🔥 Current streak before submit:", streak);

    const base = basePointsMap[difficulty!].points;
    const speedBonus = Math.round(base * calculateSpeedBonus(timeUsed));
    const streakBonus = calculateStreakBonus();
    const totalPoints = correct ? base + speedBonus + streakBonus : 0;

    if (correct) {
      setScore((s) => s + totalPoints);
      setStreak((s) => s + 1);
      setIsCorrect(true);
      console.log(`🎯 Correct! Base: ${base} SpeedBonus: ${speedBonus} StreakBonus: ${streakBonus}`);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setTimeout(() => handleNext(), 500);
    }

    clearInterval(timerRef.current!);

    setAnswers((prev) => [
      ...prev,
      {
        symbol: input,
        label: currentWord.latin,
        expected: currentWord.baybayin,
        result: correct ? "correct" : "wrong",
        pointsEarned: totalPoints,
        timeTaken: timeUsed,
      },
    ]);
  };

  const insertChallenge = useMutation(api.typing.insertTypingChallenge);

  const handleNext = async () => {
    if (currentIndex + 1 === words.length) {
      const base = basePointsMap[difficulty!].points;

      const maxScore = words.map((_, index) => {
        const speedBonus = Math.round(base * 0.5);
        let streakBonus = 0;
        if (index + 1 === 3) streakBonus = 10;
        else if (index + 1 === 5) streakBonus = 20;
        else if (index + 1 === 10) streakBonus = 50;
        return base + speedBonus + streakBonus;
      }).reduce((a, b) => a + b, 0);

      const stars = getStarRating(score, maxScore);
      const createdAt = Date.now();

      const totalTimeSpent = answers.reduce((sum, a) => sum + a.timeTaken, 0);

    try {
      await insertChallenge({
        userId: convexUserId ?? "",
        score,
        stars,
        answers,
        createdAt,
        timeSpent: totalTimeSpent,
      });

      router.replace({
        pathname: "/quiz/results",
        params: {
          score: String(score),
          stars: String(stars),
          answers: encodeURIComponent(JSON.stringify(answers)),
          lessonRoute: "SpellingQuizScreen",
        },
      });
    } catch (error) {
      console.error("❌ Failed to save typing challenge:", error);
    }
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
            onPress={() => setDifficulty(level as Difficulty)}
          >
            <Text style={[styles.optionText, difficulty === level && { color: "white" }]}>
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
            <Text style={[styles.optionText, questionCount === num && { color: "white" }]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, !(difficulty && questionCount) && { opacity: 0.5 }]}
          disabled={!(difficulty && questionCount)}
          onPress={() => {
            console.log("🎮 Starting quiz with:", { difficulty, questionCount });
            setIsSetup(false);
          }}
        >
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user || !convexUserId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontFamily: "outfit" }}>
          Loading user...
        </Text>
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

  const current = words[currentIndex];
  const total = basePointsMap[difficulty!].time;

  return (
    <View style={styles.container}>
      {/* ⏱ Circular timer in top right */}
      <View style={styles.timerContainer}>
        <Progress.Circle
          size={50}
          showsText
          formatText={() => `${timeLeft}s`}
          progress={(total - timeLeft) / total}
          color={Colors.PRIMARY}
          borderWidth={2}
          thickness={4}
          unfilledColor="#eee"
          textStyle={{ fontFamily: "outfit-bold", fontSize: 14 }}
        />
      </View>

      <View style={{ alignItems: "center" }}>
          <Text style={styles.promptText}>
            Type: {difficulty === "hard"
              ? current.latin.charAt(0).toUpperCase() + current.latin.slice(1)
              : current.latin.toLowerCase()}
          </Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{input || " "}</Text>
      </View>
      {hasSubmitted && isCorrect && (
        <Text style={styles.correctText}>Correct! ✅</Text>
      )}
      {hasSubmitted && !isCorrect && (
        <Text style={styles.errorText}>Incorrect ❌</Text>
      )}
      </View>

      {!hasSubmitted && (
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {hasSubmitted && isCorrect && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}


      <BaybayinKeyboard onKeyPress={handleKeyPress} resetSignal={resetSignal} />
    </View>
  );
}

// styles
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
  timerContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
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

});
