import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CharacterData = {
  symbol: string;
  expected: string;
  label: string;
  guideImage?: any;
};

export default function StudyScreen({
  characters,
  lessonId,
  nextScreen,
}: {
  characters: CharacterData[];
  lessonId: string;
  nextScreen: string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<"guide" | "no-guide" | "done">("guide");
  const [tries, setTries] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [clearCanvasKey, setClearCanvasKey] = useState(0);

  const char = characters[index];

  useEffect(() => {
    setIsCorrect(false);
    setTries(0);
    setClearCanvasKey((k) => k + 1); // Clear canvas when index/step changes
  }, [index, step]);

  const handlePrediction = (result: string) => {
    const correct = result.toLowerCase() === char.expected.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (step === "guide") {
          setStep("no-guide");
        } else {
          nextCharacter();
        }
      }, 800);
    } else {
      setTries((t) => {
        const newTries = t + 1;

        if (step === "no-guide" && newTries >= 3) {
          setTimeout(() => {
            setClearCanvasKey((k) => k + 1);
          }, 100); // Show guide again
        } else {
          setTimeout(() => {
            setClearCanvasKey((k) => k + 1); // Auto-clear
          }, 100);
        }

        return newTries;
      });
    }
  };

  const nextCharacter = () => {
    if (index + 1 < characters.length) {
      setIndex((i) => i + 1);
      setStep("guide");
    } else {
      setStep("done");
      setShowFinished(true);
    }
  };

  const resetLesson = () => {
    setIndex(0);
    setStep("guide");
    setTries(0);
    setIsCorrect(false);
    setShowFinished(false);
    setClearCanvasKey((k) => k + 1);
  };

  if (showFinished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Study Session Finished!</Text>
          <TouchableOpacity style={styles.button} onPress={resetLesson}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace(`/lessons/${lessonId}` as any)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const showGuide =
    step === "guide" || (step === "no-guide" && tries >= 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Write {char.symbol} ({char.label})
        </Text>

        <HandwritingCanvas
          key={`${clearCanvasKey}`}
          lesson={lessonId}
          showGuide={showGuide}
          guideImage={char.guideImage}
          onPrediction={handlePrediction}
          onClear={() => setIsCorrect(false)}
        />

        {isCorrect ? (
          <Text style={styles.feedback}>Correct!</Text>
        ) : tries > 0 ? (
          <Text style={styles.feedback}>Try again ({tries}/3)</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    textAlign: "center",
    color: Colors.PRIMARY,
    marginVertical: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
