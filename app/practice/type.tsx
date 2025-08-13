import BaybayinKeyboard from "@/components/BaybayinKeyboard";
import { useLanguage } from "@/components/LanguageContext";
import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Word = { baybayin: string; latin: string; [key: string]: any };
type Difficulty = "easy" | "medium" | "hard";

const t = {
  en: {
    selectSettings: "Select Practice Settings",
    difficulty: "Difficulty",
    numberOfQuestions: "Number of Questions",
    startQuiz: "Start Quiz",
    loadingQuiz: "Loading quiz...",
    correct: "Correct!",
    incorrect: "Incorrect",
    submit: "Submit",
    retry: "Retry",
    next: "Next",
    summary: "Quiz Summary",
    correctLabel: "Correct",
    incorrectLabel: "Incorrect",
    firstTry: "Correct on first try!",
    attempts: (n: number) => `Needed ${n} attempt${n > 1 ? "s" : ""}`,
    perfect: "Perfect! You got everything right on the first try.",
    review: "Great effort! Review the words that took more than one try.",
    backToStart: "Back to Start",
    type: "Type",
  },
  fil: {
    selectSettings: "Pumili ng Mga Setting sa Pagsasanay",
    difficulty: "Kahirapan",
    numberOfQuestions: "Bilang ng mga Tanong",
    startQuiz: "Simulan ang Pagsusulit",
    loadingQuiz: "Ikinakarga ang pagsusulit...",
    correct: "Tama!",
    incorrect: "Mali",
    submit: "Submit",
    retry: "Retry",
    next: "Next",
    summary: "Buod ng Pagsusulit",
    correctLabel: "Tama",
    incorrectLabel: "Mali",
    firstTry: "Tama sa unang subok!",
    attempts: (n: number) => `Kinailangan ng ${n} subok`,
    perfect: "Perpekto! Nakuha mong lahat ng tama sa unang subok.",
    review: "Mahusay! Balikan ang mga salitang hindi agad nasagot.",
    backToStart: "Bumalik sa Simula",
    type: "I-type",
  },
};

export default function SpellingQuizScreen() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { user } = useUser();

  const [isSetup, setIsSetup] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty | null>("easy");
  const [questionCount, setQuestionCount] = useState<number | null>(5);
  const [words, setWords] = useState<Word[]>([]);
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [seed, setSeed] = useState(() => Math.random());

  const fetchedWords = useQuery(
    api.getWords.getWords,
    !isSetup && difficulty && questionCount
      ? { difficulty, limit: questionCount, seed }
      : "skip"
  );

  useEffect(() => {
    if (fetchedWords) {
      setWords([...fetchedWords]);
    }
  }, [fetchedWords]);

  const handleKeyPress = (char: string) => {
    if (!keyboardEnabled) return;
    if (char === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + char);
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setKeyboardEnabled(false);

    const current = words[currentIndex];
    const correct = input === current.baybayin;

    setIsCorrect(correct);

    setAttempts((prev) => {
      const updated = [...prev];
      updated[currentIndex] = (updated[currentIndex] || 0) + 1;
      return updated;
    });

    if (correct) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 === words.length) {
      setShowSummary(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setInput("");
    setResetSignal((r) => r + 1);
    setHasSubmitted(false);
    setIsCorrect(false);
    setKeyboardEnabled(true);
  };

  if (isSetup) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>{t[lang].selectSettings}</Text>
        <Text style={styles.label}>{t[lang].difficulty}</Text>
        {["easy", "medium", "hard"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.optionButton,
              difficulty === level && styles.selectedOption,
            ]}
            onPress={() => setDifficulty(level as Difficulty)}
          >
            <Text
              style={[styles.optionText, difficulty === level && { color: "white" }]}
            >
              {level.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.label}>{t[lang].numberOfQuestions}</Text>
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
              style={[styles.optionText, questionCount === num && { color: "white" }]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.button, !(difficulty && questionCount) && { opacity: 0.5 }]}
          disabled={!(difficulty && questionCount)}
          onPress={() => setIsSetup(false)}
        >
          <Text style={styles.buttonText}>{t[lang].startQuiz}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user || !words || words.length === 0) {
    return (
      <View style={styles.centered}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontFamily: "outfit" }}>
          {t[lang].loadingQuiz}
        </Text>
      </View>
    );
  }

  const current = words[currentIndex];

  if (showSummary) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            alignItems: "center",
            paddingBottom: 60,
          }}
        >
          <Text style={styles.title}>{t[lang].summary}</Text>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={45} color="green" />
              <Text style={styles.bigStat}>
                {t[lang].correctLabel}: {correctCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="close-circle" size={45} color="red" />
              <Text style={styles.bigStat}>
                {t[lang].incorrectLabel}: {incorrectCount}
              </Text>
            </View>
          </View>

          <View style={styles.summaryList}>
            {words.map((word, index) => {
              const tries = attempts[index] || 1;
              const correct = tries === 1;
              return (
                <View
                  key={index}
                  style={[
                    styles.wordCard,
                    correct ? styles.correctCard : styles.incorrectCard,
                  ]}
                >
                  <Ionicons
                    name={correct ? "checkmark-circle" : "close-circle"}
                    size={24}
                    color={correct ? "green" : "red"}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.wordLatin}>{word.latin}</Text>
                  <Text style={styles.wordBaybayin}>{word.baybayin}</Text>
                  <Text style={correct ? styles.tryCount : styles.tryCountBold}>
                    {correct
                      ? t[lang].firstTry
                      : t[lang].attempts(tries)}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.message}>
            {incorrectCount === 0
              ? t[lang].perfect
              : t[lang].review}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowSummary(false);
              setIsSetup(true);
              setDifficulty(null);
              setQuestionCount(null);
              setCurrentIndex(0);
              setCorrectCount(0);
              setIncorrectCount(0);
              setWords([]);
              setInput("");
              setAttempts([]);
              setSeed(Math.random());
              setResetSignal((r) => r + 1);
              setHasSubmitted(false);
              setIsCorrect(false);
              setKeyboardEnabled(true);
            }}
          >
            <Text style={styles.buttonText}>{t[lang].backToStart}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>
      <View style={styles.quizGroup}>
        <Text style={styles.promptText}>
          {t[lang].type}:{" "}
          {difficulty === "hard"
            ? current.latin.charAt(0).toUpperCase() + current.latin.slice(1)
            : current.latin.toLowerCase()}
        </Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>{input || " "}</Text>
        </View>

        {hasSubmitted && isCorrect && (
          <Text style={styles.correctText}>{t[lang].correct} ✅</Text>
        )}
        {hasSubmitted && !isCorrect && (
          <Text style={styles.errorText}>{t[lang].incorrect} ❌</Text>
        )}
      </View>

      {!hasSubmitted && (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t[lang].submit}</Text>
        </TouchableOpacity>
      )}

      {hasSubmitted && !isCorrect && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setInput("");
            setHasSubmitted(false);
            setKeyboardEnabled(true);
          }}
        >
          <Text style={styles.buttonText}>{t[lang].retry}</Text>
        </TouchableOpacity>
      )}

      {hasSubmitted && isCorrect && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{t[lang].next}</Text>
        </TouchableOpacity>
      )}

      <BaybayinKeyboard
        onKeyPress={handleKeyPress}
        resetSignal={resetSignal}
        disabled={!keyboardEnabled}
      />
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
  selectedOption: { backgroundColor: Colors.PRIMARY },
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
  promptText: {
    textAlign: "center",
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
  quizGroup: {
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginTop: 24,
    textAlign: "center",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    width: "100%",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    gap: 6,
  },
  bigStat: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  summaryList: {
    width: "100%",
    marginTop: 10,
  },
  wordCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  wordLatin: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 4,
    color: Colors.PRIMARY,
  },
  wordBaybayin: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: "#333",
    marginBottom: 6,
  },
  tryCount: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.GRAY,
  },
  tryCountBold: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: "red",
  },
  correctCard: {
  backgroundColor: "#e6ffec", // light green
  borderColor: "#b2f2bb",
},

incorrectCard: {
  backgroundColor: "#ffe6e6", // light red
  borderColor: "#f5c2c7",
},

cardIcon: {
  position: "absolute",
  fontSize: 40,
  top: 10,
  right: 10,
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
