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

export default function Lesson1() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const router = useRouter();
  useEffect(() => {
  setPrediction(null);
  setIsCorrect(false);
  }, [step]);

  const handwritingStepIndex = 5;

  const steps = [
    {
      type: "custom",
      render: () => (
        <Text style={styles.paragraph}>
          Welcome!{"\n\n"}You're about to learn{" "}
          <Text style={styles.bold}>Baybayin</Text>, the ancient script of the Philippines.{"\n\n"}
          <Text style={styles.italic}>Baybayin</Text> is a pre-colonial writing system once used to write Tagalog and other Philippine languages.{"\n\n"}
          Press <Text style={styles.bold}>Continue</Text> if you're ready to begin your journey into Baybayin.
        </Text>
      ),
    },
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.paragraph}>
            Baybayin has three vowel characters.{"\n\n"}
            They each represent simple sounds — let's go through them one by one.
          </Text>
        </View>
      ),
    },
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.character}>ᜀ</Text>
          <Text style={styles.paragraph}>
            This is the sound "A" — like the a in{" "}
            <Text style={styles.italic}>anak</Text> (child).{"\n\n"}
            Say it out loud:
          </Text>
          <TouchableOpacity style={styles.audioButton} onPress={() => console.log("Play audio")}>
            <Text style={styles.audioButtonText}>🔊</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.title}>Let's try writing ᜀ!</Text>
          <HandwritingCanvas
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "a");
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
          <Text style={styles.character}>ᜁ</Text>
          <Text style={styles.paragraph}>
            This one is for the "E" and "I" sounds.{"\n\n"}
            Like the i in <Text style={styles.italic}>ibig</Text> (love), or the e in <Text style={styles.italic}>bebe</Text> (baby).{"\n\n"}
            Say it out loud:
          </Text>
          <TouchableOpacity style={styles.audioButton} onPress={() => console.log("Play audio")}>
            <Text style={styles.audioButtonText}>🔊</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.title}>Let's try writing ᜁ!</Text>
          <HandwritingCanvas
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "e_i");
            }}
            onClear={() => {
              setPrediction(null);
              setIsCorrect(false);
            }}
          />
          {prediction && (
            <Text style={styles.paragraph}>
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
          <Text style={styles.character}>ᜂ</Text>
          <Text style={styles.paragraph}>
            This character is used for both "U" and "O" sounds.{"\n\n"}
            Like the u in <Text style={styles.italic}>ulo</Text> (head), or the o in <Text style={styles.italic}>aso</Text> (dog).{"\n\n"}
            Say it out loud:
          </Text>
          <TouchableOpacity style={styles.audioButton} onPress={() => console.log("Play audio")}>
            <Text style={styles.audioButtonText}>🔊</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      type: "custom",
      render: () => (
        <View>
          <Text style={styles.title}>Let's try writing ᜂ!</Text>
          <HandwritingCanvas
            onPrediction={(result) => {
              setPrediction(result);
              setIsCorrect(result.toLowerCase() === "o_u");
            }}
            onClear={() => {
              setPrediction(null);
              setIsCorrect(false);
            }}
          />
          {prediction && (
            <Text style={styles.paragraph}>
              {isCorrect ? "Correct!" : "Try again"}
            </Text>
          )}
        </View>
      ),
    },

    {
      type: "custom",
      render: () => (
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Good job!</Text> {"\n\n"}
          You've just written all three Baybayin vowels: ᜀ (A), ᜁ (E/I), and ᜂ (U/O). {"\n\n"}
          Take a moment to remember their shapes and sounds.{"\n\n"}
          <Text style={styles.bold}>When you're ready, let's move on to a quick quiz!</Text>
        </Text>
      ),
    },
    {
      type: "quiz-link",
    },
    //type: "exercise for ungraded quizzes"
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
              [3, 5, 7].includes(step) && !isCorrect
                ? { backgroundColor: "#ccc" }
                : {},
            ]}
            onPress={handleContinue}
            disabled={step === handwritingStepIndex && !isCorrect}
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