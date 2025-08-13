import { useLanguage } from "@/components/LanguageContext";
import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
    explanation: {
      en: "Adding the kudlit above changes the vowel to E/I, making it ‘pe’ or ‘pi’.",
      fil: "Kapag inilagay ang kudlit sa ibabaw, nagiging tunog na E/I, kaya nagiging ‘pe’ o ‘pi’.",
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
    explanation: {
      en: "Adding the kudlit below changes the vowel to O/U, making it ‘do’ or ‘du’.",
      fil: "Kapag inilagay sa ilalim ang kudlit, nagiging tunog na O/U, kaya nagiging ‘do’ o ‘du’.",
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
    explanation: {
      en: "The plus sign adds a final consonant, so this becomes ‘ng’ with no vowel.",
      fil: "Ang simbolong plus ay nagdaragdag ng katinig sa dulo, kaya nagiging ‘ng’ nang walang patinig.",
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
  const handleDrop = (zone: "top" | "bottom", data: { title?: string }) => {
    if (!data?.title) return;
    const marker = data.title as "Kudlit" | "Plus";
    setDroppedZone(zone);
    setDroppedMarker(marker);
    const correct = marker === page.correctMarker && zone === page.correctDrop;
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
          <AnimatedLessonText>
            {lang === "en"
              ? "Well done! You’ve completed the kudlit lesson and learned how each marker changes the sound of a character."
              : "Magaling! Natapos mo na ang aralin sa kudlit at natutunan kung paano binabago ng bawat marka ang tunog ng isang karakter."}
          </AnimatedLessonText>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await playSound("click");
              resetLesson();
            }}
          >
            <Text style={styles.buttonText}>
              {lang === "en" ? "Retry" : "Ulitin"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await playSound("click");
              router.replace(`/lessons/lesson7`);
            }}
          >
            <Text style={styles.buttonText}>
              {lang === "en" ? "Continue" : "Magpatuloy"}
            </Text>
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
            router.back();
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
                    "In Baybayin, the kudlit is a tiny mark that changes a character’s vowel sound. When placed above, the vowel becomes “E” or “I.” Let’s try it!"}
                  {lang === "fil" && currentPage.contentKey === 1 &&
                    "Sa Baybayin, ang kudlit ay maliit na marka na nagpapalit ng tunog ng patinig. Kapag inilagay sa ibabaw, nagiging tunog na “E” o “I.” Subukan natin!"}

                  {lang === "en" && currentPage.contentKey === 2 &&
                    "When placed below the character, the kudlit changes the vowel to “O” or “U.” Let’s see it!"}
                  {lang === "fil" && currentPage.contentKey === 2 &&
                    "Kapag inilagay sa ilalim ng karakter, nagiging tunog na “O” o “U.” Tingnan natin!"}

                  {lang === "en" && currentPage.contentKey === 3 &&
                    "The plus sign works differently. It adds a final consonant sound instead of changing the vowel."}
                  {lang === "fil" && currentPage.contentKey === 3 &&
                    "Iba naman ang plus sign. Nagdaragdag ito ng tunog na katinig sa dulo ng karakter."}
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
              onPress={handleNext}
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
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: "center" },
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
    marginTop: 40,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  feedbackCorrect: {
    color: "green",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  feedbackWrong: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
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
