import { useLanguage } from "@/components/LanguageContext";
import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Draggable,
  DropProvider,
  Droppable,
} from "react-native-reanimated-dnd";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
type TextPage = {
  type: "text";
  contentKey: number;
  example?: string;
  exampleTransformed?: string;
};

type DragPage = {
  type: "drag";
  character: string;
  correctMarker: "Kudlit" | "Plus";
  correctDrop: "top" | "bottom";
  instructionText: { en: string; fil: string };
  explanation: { en: string; fil: string };
};

type LessonPage = TextPage | DragPage;

// Lesson Data
const lessonData: LessonPage[] = [
  {
    type: "text",
    contentKey: 1,
    example: "ᜉ",
    exampleTransformed: "ᜉᜒ",
  },
  {
    type: "drag",
    character: "ᜉ",
    correctDrop: "top",
    correctMarker: "Kudlit",
    instructionText: {
      en: "Drag the kudlit above to change PA to PE/PI.",
      fil: "I-drag ang kudlit sa ibabaw para maging tunog na PE/PI.",
    },
    explanation: {
      en: "The kudlit above changes the vowel to E or I.",
      fil: "Ang kudlit sa ibabaw ay nagiging tunog na E o I.",
    },
  },
  {
    type: "drag",
    character: "ᜉ",
    correctDrop: "top",
    correctMarker: "Kudlit",
    instructionText: {
      en: "Try it again! Drag the kudlit above to change PA to PE/PI.",
      fil: "Subukan muli! I-drag ang kudlit sa ibabaw para maging tunog na PE/PI.",
    },
    explanation: {
      en: "Remember, the kudlit above changes the vowel to E or I.",
      fil: "Tandaan, ang kudlit sa ibabaw ay nagiging tunog na E o I.",
    },
  },
  {
    type: "text",
    contentKey: 2,
    example: "ᜇ",
    exampleTransformed: "ᜇᜓ",
  },
  {
    type: "drag",
    character: "ᜇ",
    correctDrop: "bottom",
    correctMarker: "Kudlit",
    instructionText: {
      en: "Drag the kudlit below to change DA to DO/DU.",
      fil: "I-drag ang kudlit sa ilalim para maging tunog na DO/DU.",
    },
    explanation: {
      en: "The kudlit below changes the vowel to O or U.",
      fil: "Ang kudlit sa ilalim ay nagiging tunog na O o U.",
    },
  },
  {
    type: "drag",
    character: "ᜇ",
    correctDrop: "bottom",
    correctMarker: "Kudlit",
    instructionText: {
      en: "Try it again! Drag the kudlit below to change DA to DO/DU.",
      fil: "Subukan muli! I-drag ang kudlit sa ilalim para maging tunog na DO/DU.",
    },
    explanation: {
      en: "Remember, the kudlit below changes the vowel to O or U.",
      fil: "Tandaan, ang kudlit sa ilalim ay nagiging tunog na O o U.",
    },
  },
  {
    type: "text",
    contentKey: 3,
    example: "ᜅ",
    exampleTransformed: "ᜅ᜔",
  },
  {
    type: "drag",
    character: "ᜅ",
    correctDrop: "bottom",
    correctMarker: "Plus",
    instructionText: {
      en: "Drag the plus sign to remove the vowel and make ‘ng’.",
      fil: "I-drag ang simbolong plus para alisin ang patinig at maging ‘ng’.",
    },
    explanation: {
      en: "The plus sign removes the vowel, leaving only the consonant sound ‘ng’.",
      fil: "Ang simbolong plus ay nag-aalis ng patinig, kaya nagiging tunog na ‘ng’ lamang.",
    },
  },
  {
    type: "drag",
    character: "ᜅ",
    correctDrop: "bottom",
    correctMarker: "Plus",
    instructionText: {
      en: "Try it again! Drag the plus sign to make ‘ng’.",
      fil: "Subukan muli! I-drag ang simbolong plus para maging ‘ng’.",
    },
    explanation: {
      en: "Remember, the plus sign removes the vowel to leave ‘ng’.",
      fil: "Tandaan, ang simbolong plus ay nag-aalis ng patinig para maging ‘ng’.",
    },
  },
];



// Animated text wrapper
function AnimatedLessonText({ children }: { children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.Text style={[styles.lessonText, { opacity: fadeAnim }]}>
      {children}
    </Animated.Text>
  );
}

export default function LessonDragScreen() {
  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.replace("/lessons/lesson7"); // Go to your target page
      return true; // Prevent default behavior
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove(); // Cleanup on unmount
  }, [router]);

  const [index, setIndex] = useState(0);
  const [dragKey, setDragKey] = useState(Date.now());
  const [droppedZone, setDroppedZone] = useState<"top" | "bottom" | null>(null);
  const [droppedMarker, setDroppedMarker] = useState<"Kudlit" | "Plus" | null>(
    null
  );
  const [showWrong, setShowWrong] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showFinished, setShowFinished] = useState(false);

  const isLast = index === lessonData.length - 1;
  const currentPage = lessonData[index];

  // Drop zone animations
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const triggerPulse = () => {
    pulseAnim.setValue(1);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetLesson = () => {
    setIndex(0);
    setDragKey(Date.now());
    setDroppedZone(null);
    setDroppedMarker(null);
    setShowWrong(false);
    setIsAnswerCorrect(false);
    setShowFinished(false);
  };

  const handleNext = () => {
    if (!isAnswerCorrect && currentPage.type === "drag") return;
    if (isLast) {
      setShowFinished(true);
    } else {
      setIndex((prev) => prev + 1);
      setDroppedMarker(null);
      setDroppedZone(null);
      setIsAnswerCorrect(false);
      setShowWrong(false);
      setDragKey(Date.now());
    }
  };

const renderDragPage = (page: DragPage) => {
  const handleDrop = async (zone: "top" | "bottom", data: { title?: string }) => {
    if (!data?.title) return;
    const marker = data.title as "Kudlit" | "Plus";
    setDroppedZone(zone);
    setDroppedMarker(marker);
    const correct = marker === page.correctMarker && zone === page.correctDrop;
    await playSound(correct ? "correct" : "wrong");
    setIsAnswerCorrect(correct);
    setShowWrong(!correct);

    if (correct) {
      triggerPulse();
    } else {
      triggerShake();
      setTimeout(() => {
        setDragKey(Date.now());
        setDroppedZone(null);
        setDroppedMarker(null);
        setShowWrong(false);
      }, 700);
    }
  };

  const renderLockedMarker = (marker: "Kudlit" | "Plus") => {
    if (marker === "Kudlit") {
      return (
        <View style={[styles.draggableItem, { borderColor: "transparent" }]}>
          <Text style={styles.itemText}>•</Text>
        </View>
      );
    }
    return (
      <View style={[styles.draggableItem, { borderColor: "transparent" }]}>
        <Text style={styles.plusItemText}>+</Text>
      </View>
    );
  };

  return (
    <View style={styles.scrollContent}>
    <Text style={styles.textInstruction}>
      {lang === "en" ? page.instructionText?.en : page.instructionText?.fil}
    </Text>
      <Animated.View
        style={[
          styles.characterStack,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        {/* Top drop zone */}
        {( !isAnswerCorrect || page.correctDrop === "top" ) && (
          <Droppable
            key="top-zone"
            onDrop={(data: { title?: string }) => handleDrop("top", data)}
            style={styles.droppable}
          >
            <Animated.View
              style={[
                styles.dropZone,
                showWrong && droppedZone === "top" && styles.dropZoneWrong,
                isAnswerCorrect &&
                  page.correctDrop === "top" &&
                  styles.dropZoneCorrect,
                isAnswerCorrect &&
                  page.correctDrop === "top" &&
                  { borderColor: "transparent" }, // Hide border when correct
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {isAnswerCorrect &&
                droppedZone === "top" &&
                renderLockedMarker(droppedMarker!)}
            </Animated.View>
          </Droppable>
        )}

        <Text style={styles.bigCharacter}>{page.character}</Text>

        {/* Bottom drop zone */}
        {( !isAnswerCorrect || page.correctDrop === "bottom" ) && (
          <Droppable
            key="bottom-zone"
            onDrop={(data: { title?: string }) => handleDrop("bottom", data)}
            style={styles.droppable}
          >
            <Animated.View
              style={[
                styles.dropZone,
                showWrong && droppedZone === "bottom" && styles.dropZoneWrong,
                isAnswerCorrect &&
                  page.correctDrop === "bottom" &&
                  styles.dropZoneCorrect,
                isAnswerCorrect &&
                  page.correctDrop === "bottom" &&
                  { borderColor: "transparent" }, // Hide border when correct
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {isAnswerCorrect &&
                droppedZone === "bottom" &&
                renderLockedMarker(droppedMarker!)}
            </Animated.View>
          </Droppable>
        )}
      </Animated.View>

      {/* Draggable markers */}
      {!isAnswerCorrect && (
        <View style={styles.draggableRow}>
          <Draggable<{ title: "Kudlit" }>
            key={dragKey + "-kudlit"}
            data={{ title: "Kudlit" }}
          >
            <View style={styles.draggableItem}>
              <Text style={styles.itemText}>•</Text>
            </View>
          </Draggable>

          <Draggable<{ title: "Plus" }>
            key={dragKey + "-plus"}
            data={{ title: "Plus" }}
          >
            <View style={styles.draggableItem}>
              <Text style={styles.plusItemText}>+</Text>
            </View>
          </Draggable>
        </View>
      )}

      {isAnswerCorrect && (
        <Text style={styles.feedbackCorrect}>
          {lang === "en" ? page.explanation.en : page.explanation.fil}
        </Text>
      )}
      {showWrong && (
        <Text style={styles.feedbackWrong}>
          {lang === "en"
            ? "Not quite, try again!"
            : "Hindi tama, subukan muli!"}
        </Text>
      )}
    </View>
  );
};


  // Finish screen
  if (showFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContent}>
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
              router.replace("/lessons/lesson7");
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={async () => {
            await playSound("click");
            router.replace('/lessons/lesson7');
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>

        <DropProvider>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {currentPage.type === "text" && (
              <>
                <AnimatedLessonText>
                  {lang === "en" && currentPage.contentKey === 1 &&
                    "In Baybayin, the kudlit is a small mark that changes a character’s vowel sound.\n\n" +
                    "When placed above, the vowel becomes “E” or “I.”\n\n" +
                    "Let’s try it!"}
                  {lang === "fil" && currentPage.contentKey === 1 &&
                    "Sa Baybayin, ang kudlit ay maliit na marka na nagpapalit ng tunog ng patinig.\n\n" +
                    "Kapag inilagay sa ibabaw, nagiging tunog na “E” o “I.”\n\n" +
                    "Subukan natin!"}

                  {lang === "en" && currentPage.contentKey === 2 &&
                    "When placed below the character, the kudlit changes the vowel to “O” or “U.”\n\n" +
                    "Give it a try!"}
                  {lang === "fil" && currentPage.contentKey === 2 &&
                    "Kapag inilagay sa ilalim ng karakter, nagiging tunog na “O” o “U.”\n\n" +
                    "Subukan mo!"}

                  {lang === "en" && currentPage.contentKey === 3 &&
                    "The plus sign works differently. It adds a final consonant sound instead of changing the vowel.\n\n" +
                    "Try it out!"}
                  {lang === "fil" && currentPage.contentKey === 3 &&
                    "Iba naman ang plus sign. Nagdaragdag ito ng tunog na katinig sa dulo ng karakter.\n\n" +
                    "Subukan mo!"}
                </AnimatedLessonText>


                {currentPage.example && (
                  <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Text style={styles.exampleChar}>
                      {currentPage.example}
                    </Text>
                    <Text style={{ fontSize: 24 }}>↓</Text>
                    <Text style={styles.exampleChar}>
                      {currentPage.exampleTransformed}
                    </Text>
                  </View>
                )}
              </>
            )}

            {currentPage.type === "drag" && renderDragPage(currentPage)}

            <TouchableOpacity
              style={[
                styles.button,
                currentPage.type === "drag" &&
                  !isAnswerCorrect &&
                  styles.buttonDisabled,
              ]}
              onPress={async () => {
                await playSound('click');
                handleNext();
              }}
              disabled={currentPage.type === "drag" && !isAnswerCorrect}
            >
              <Text style={styles.buttonText}>
                {isLast
                  ? lang === "en"
                    ? "Finish"
                    : "Tapos"
                  : lang === "en"
                  ? "Next"
                  : "Susunod"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </DropProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  scrollContent: { flexGrow: 1, padding: 28, justifyContent: "center" },
  lessonText: {
    fontSize: 20,
    color: Colors.PRIMARY,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
  exampleChar: {
    fontSize: 80,
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  textInstruction: {
    fontSize: 18,
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "outfit-bold",
  },
  characterStack: { alignItems: "center", gap: 1, marginBottom: 30 },
  droppable: { height: 60, width: 60 },
  dropZone: {
    flex: 1,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: Colors.GREY_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneWrong: { borderColor: "red", backgroundColor: "#ffe5e5" },
  dropZoneCorrect: { borderColor: "green", backgroundColor: "#e5ffe5" },
  bigCharacter: {
    fontSize: 250,
    color: Colors.PRIMARY,
    textAlign: "center",
    lineHeight: 210,
    includeFontPadding: false,
    marginTop: -30,
  },
  draggableRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  draggableItem: {
    height: 61,
    width: 61,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  itemText: {
    color: Colors.PRIMARY,
    fontSize: 70,
    textAlign: "center",
    lineHeight: 61,
    includeFontPadding: false,
  },
  plusItemText: {
    color: Colors.PRIMARY,
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 23,
    includeFontPadding: false,
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
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  feedbackCorrect: {
    color: "green",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "outfit",
  },
  feedbackWrong: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "outfit",
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
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    marginBottom: 24,
    color: Colors.PRIMARY,
    textAlign: "center",
  },
});
