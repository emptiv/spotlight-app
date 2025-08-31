// imports
import BaybayinKeyboard from "@/components/BaybayinKeyboard";
import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
const getStarRating = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 100) return 3;   // perfect score
  if (percentage >= 60) return 2;    // was 75, now more forgiving
  if (percentage == 0) return 0;
  return 1;
};

export default function SpellingQuizScreen() {
  const router = useRouter();
  const { user } = useUser();

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: user?.id || "",
  });

  const [answers, setAnswers] = useState<any[]>([]);
  const [isSetup, setIsSetup] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [hearts, setHearts] = useState<number>(3);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5); // default 10


  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [seed] = useState(() => Math.random());

  const fetchedWords = useQuery(
    api.getWords.getWords,
    !isSetup && difficulty && questionCount
      ? { difficulty, limit: questionCount, seed }
      : "skip"
  );

  useEffect(() => {
    if (fetchedWords) {
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

  // Exit confirmation
  const handleExitQuiz = () => {
    Alert.alert(
      "Leave Quiz?",
      "Your progress will be lost. Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
    return true;
  };

  // Android back button override
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleExitQuiz
    );
    return () => backHandler.remove();
  }, []);

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

  const calculateStreakBonus = (newStreak: number) => {
    if (newStreak >= 3) {
      return 5;
    }
    return 0;
  };

  const handleKeyPress = (char: string) => {
    if (char === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + char);
    }
  };

  const handleSubmit = async (isTimeout = false) => {
    setHasSubmitted(true);
    const currentWord = words[currentIndex];
    const correct = input === currentWord.baybayin;

    // Set feedback immediately
    setIsCorrect(correct);

    // Deduct hearts if wrong
    if (!correct) {
      setStreak(0);
      setHearts((h) => Math.max(0, h - 1));
    } else {
      setStreak((s) => s + 1);
      const streakBonus = calculateStreakBonus(streak + 1);
      setScore((s) => s + basePointsMap[difficulty!].points + streakBonus);
    }

    // Play sound after feedback is set
    await playSound(correct ? "correct" : "wrong");

    // Save answer
    setAnswers((prev) => [
      ...prev,
      {
        symbol: input,
        label: currentWord.latin,
        expected: currentWord.baybayin,
        result: correct ? "correct" : "wrong",
        pointsEarned: correct ? basePointsMap[difficulty!].points + calculateStreakBonus(streak + 1) : 0,
        timeTaken: basePointsMap[difficulty!].time - timeLeft,
      },
    ]);

    clearInterval(timerRef.current!);

    // Move to next question automatically for wrong answers if hearts remain
    if (!correct && hearts > 1) {
      setTimeout(() => handleNext(), 500);
    } else if (!correct && hearts <= 1) {
      handleNext(true, true); // game over
    }
  };



  const insertChallenge = useMutation(api.typing.insertTypingChallenge);

  const handleNext = async (forceFinish = false, isGameOver = false) => {
    if (currentIndex + 1 === words.length || forceFinish) {
      const base = basePointsMap[difficulty!].points;

    const maxScore = words.map((_, index) => {
      const base = basePointsMap[difficulty!].points;
      // Starting from question 3 (index 2), add +5 points per question for streak bonus
      const streakBonus = index >= 2 ? 5 : 0;
      return base + streakBonus;
    }).reduce((a, b) => a + b, 0);

      const heartsUsedCount = 3 - hearts;
      const newlyAwardedBadges: string[] = [];
      if (heartsUsedCount === 0) {
        newlyAwardedBadges.push("Perfectionist");
      }

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
          numberOfQuestions,
          difficulty,
          heartsUsed: heartsUsedCount,
        });

        router.replace({
          pathname: "/quiz/results",
          params: {
            score: String(score),
            stars: String(stars),
            answers: encodeURIComponent(JSON.stringify(answers)),
            badges: encodeURIComponent(JSON.stringify(newlyAwardedBadges)),
            lessonRoute: "SpellingQuizScreen",
            gameOver: isGameOver ? "true" : "false",
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={async () => {
            await playSound('click');
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
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
          onPress={async () => {
            await playSound('click');
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
      {/* Exit button */}
      <TouchableOpacity style={styles.exitButton} 
        onPress={async () => {
          await playSound('click');
          handleExitQuiz();
        }}
        >
        <Ionicons name="close" size={28} color={Colors.PRIMARY} />
      </TouchableOpacity>

      {/* Timer */}
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

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10, marginBottom: 12 }}>
        {[...Array(3)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < hearts ? "heart" : "heart-outline"}
            size={24}
            color={i < hearts ? Colors.HEART : Colors.HEART_EMPTY}
            style={{ marginHorizontal: 4 }}
          />
        ))}
        {/* Streak Indicator */}
        {streak > 0 && (
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={28} color="#FF6B00" />
            <Text style={styles.streakText}>x{streak}</Text>
          </View>
        )}
      </View>

      {/* Prompt */}
      <View style={{ alignItems: "center" }}>
        <Text style={styles.promptText}>
          Type: {difficulty === "hard"
            ? current.latin.charAt(0).toUpperCase() + current.latin.slice(1)
            : current.latin.toLowerCase()}
        </Text>
        <View
          style={[
            styles.inputBox,
            hasSubmitted && isCorrect && { borderColor: "green", backgroundColor: "#e6ffec" },
            hasSubmitted && !isCorrect && { borderColor: "red", backgroundColor: "#ffe6e6" },
          ]}
        >
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
        <TouchableOpacity style={styles.button} 
        onPress={async () => {
          await playSound('click');
          handleSubmit();
        }}
          >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {hasSubmitted && isCorrect && (
        <TouchableOpacity style={styles.button} 
        onPress={async () => {
          await playSound('click');
          handleNext();
        }}
          >
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
  timerContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  exitButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 100,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
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
    fontFamily: "outfit"
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
streakContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
},
streakText: {
  fontSize: 18,
  fontFamily: "outfit-bold",
  color: "#FF6B00",
  marginLeft: 6,
},
overlayContainer: {
  position: "absolute",
  top: "48%",
  left: 0,
  right: 0,
  alignItems: "center",
  opacity: 1, // semi-transparent
  zIndex: 50,
},
overlayImage: {
  width: 200,
  height: 200,

},
});
