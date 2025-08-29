import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
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
  modelName?: string;
  guideGIF?: any;
  gifDuration?: number;
};

export default function StudyScreen({
  characters,
  lessonId,
  lessonSlug,
  nextScreen,
}: {
  characters: CharacterData[];
  lessonId: string;
  nextScreen: string;
  lessonSlug?: string; // Optional slug for future use
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

          <Image 
            source={require('@/assets/ming/heart.png')} 
            style={styles.image} 
            resizeMode="contain"
          />

          {/* Orange bordered box */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Job well done, kaibigan!{"\n"}Keep it up!
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={async () => {
              await playSound('click');
              resetLesson();
            }}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await playSound('click');
              router.replace(`/lessons/${lessonSlug}` as any);
            }}
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          await playSound("click");
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>



      <View style={styles.content}>
        <Text style={styles.title}>
          Write {char.label}
        </Text>

        <HandwritingCanvas
          key={`${clearCanvasKey}`}
          lesson={char.modelName || lessonId}
          character={char.expected}
          showGuide={showGuide}
          guideImage={char.guideImage}
          guideGIF={char.guideGIF}
          gifDuration={char.gifDuration}
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
    fontFamily: "outfit-bold",
    fontSize: 20,
    textAlign: "center",
    color: Colors.PRIMARY,
    marginVertical: 12,
  },
  button: {
    marginTop: 20,
    width: '65%',
    alignSelf: 'center',
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontFamily: "outfit-bold",
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
  image: {
    width: 300,
    height: 300,
    marginBottom: 10,
    alignSelf: 'center',
  },
  messageBox: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY, // orange border
    borderRadius: 20,
    width: '80%',
    alignSelf: 'center',
    padding: 12,
    marginVertical: 16,
    backgroundColor: Colors.WHITE, // light background to make it stand out
    alignItems: "center",
  },
  messageText: {
    fontSize: 17,
    fontFamily: "outfit",
    color: Colors.PRIMARY, // darker orange text
    textAlign: "center",
  },
});
