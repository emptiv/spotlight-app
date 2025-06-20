import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Lesson6() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPrediction(null);
    setIsCorrect(false);
  }, [step]);

  const handwritingStepIndex = step; // dynamically enforced

  const steps = [
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.title}>Let's try writing ᜋ!</Text>
          <HandwritingCanvas
            key={`canvas-${step}`}
            lesson="lesson6"
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "ma");
            }}
            onClear={() => {
              setPrediction(null);
              setIsCorrect(false);
            }}
          />
          {prediction && (
            <Text style={styles.feedback}>
              {isCorrect ? "Correct!" : "Try again"}
            </Text>
          )}
        </View>
      ),
    },
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.title}>Let's try writing ᜌ!</Text>
          <HandwritingCanvas
          key={`canvas-${step}`}
            lesson="lesson6"
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "ya");
            }}
            onClear={() => {
              setPrediction(null);
              setIsCorrect(false);
            }}
          />
          {prediction && (
            <Text style={styles.feedback}>
              {isCorrect ? "Correct!" : "Try again"}
            </Text>
          )}
        </View>
      ),
    },
    {
      type: "quiz-link",
    },
    {
      type: "exercise",
      question: "How many hours do cats sleep daily?",
      options: ["8", "12", "16"],
      answer: "16",
    },
  ];

  const handleContinue = () => {
    setSelected(null);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleAnswer = (option: string) => {
    setSelected(option);
    setTimeout(() => {
      handleContinue();
    }, 600);
  };

  const current = steps[step];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerButton}>Quit</Text>
        </TouchableOpacity>
        <Text style={styles.hearts}>❤️ x 3</Text>
        <TouchableOpacity>
          <Text style={styles.headerButton}>⚠️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {current.render && current.render()}

        {current.type === "exercise" && (
          <View>
            <Text style={styles.question}>{current.question}</Text>
            {current.options?.map((option) => {
              const isCorrect = option === current.answer;
              const isSelected = selected === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleAnswer(option)}
                  disabled={!!selected}
                  style={[
                    styles.option,
                    isSelected && {
                      backgroundColor: isCorrect ? Colors.SUCCESS : "#f88",
                    },
                  ]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {current.type === "quiz-link" && (
          <Link href="/quiz/q-lesson-1" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {current.type !== "quiz-link" && current.type !== "exercise" && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              [0, 1].includes(step) && !isCorrect
                ? { backgroundColor: "#ccc" }
                : {},
            ]}
            onPress={handleContinue}
            disabled={[0, 1].includes(step) && !isCorrect}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerButton: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  hearts: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.BLACK,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    marginBottom: 24,
    color: Colors.PRIMARY,
  },
  feedback: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    marginBottom: 24,
    color: Colors.PRIMARY,
    textAlign: "center",
  },
  question: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    marginBottom: 16,
    color: Colors.PRIMARY,
  },
  option: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.BLACK,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: Colors.WHITE,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
