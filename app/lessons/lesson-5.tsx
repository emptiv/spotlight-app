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

export default function Lesson5() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPrediction(null);
    setIsCorrect(false);
  }, [step]);

  const steps = [
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.title}>Let's try writing ᜅ!</Text>
          <HandwritingCanvas
            key={`canvas-${step}`}
            lesson="lesson5"
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "nga");
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
          <Text style={styles.title}>Let's try writing ᜏ!</Text>
          <HandwritingCanvas
            key={`canvas-${step}`}
            lesson="lesson5"
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "wa");
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
          <Text style={styles.title}>Let's try writing ᜎ!</Text>
          <HandwritingCanvas
            key={`canvas-${step}`}
            lesson="lesson5"
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "la");
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

  const handwritingSteps = steps
    .map((step, index) => (step.type === "custom" ? index : -1))
    .filter((index) => index !== -1);

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
              const isCorrectOption = option === current.answer;
              const isSelectedOption = selected === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleAnswer(option)}
                  disabled={!!selected}
                  style={[
                    styles.option,
                    isSelectedOption && {
                      backgroundColor: isCorrectOption ? Colors.SUCCESS : "#f88",
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
              handwritingSteps.includes(step) && !isCorrect
                ? { backgroundColor: "#ccc" }
                : {},
            ]}
            onPress={handleContinue}
            disabled={handwritingSteps.includes(step) && !isCorrect}
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
  paragraph: {
    fontSize: 20,
    fontFamily: "outfit",
    marginBottom: 24,
    color: Colors.BLACK,
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
  character: {
    fontSize: 150,
    fontFamily: "outfit-bold",
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
  bold: {
    fontFamily: "outfit-bold",
  },
  italic: {
    fontStyle: "italic",
    fontFamily: "outfit",
  },
  audioButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    alignSelf: "center",
  },
  audioButtonText: {
    color: Colors.WHITE,
    fontSize: 35,
    fontFamily: "outfit-bold",
  },
});
