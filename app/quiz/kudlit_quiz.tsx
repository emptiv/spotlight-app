import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useConvex, useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Draggable,
  DropProvider,
  Droppable,
} from "react-native-reanimated-dnd";
import Svg, { Rect } from "react-native-svg";


import { GestureHandlerRootView } from "react-native-gesture-handler";


type CharacterData = {
  symbol: string;
  expected: string;
  label: string;
  correctDrop?: "top" | "bottom";
  correctMarker?: "Kudlit" | "Plus";
};

const BAYBAYIN_BASES = [
  { base: "p", symbol: "ᜉ" },
  { base: "k", symbol: "ᜃ" },
  { base: "n", symbol: "ᜈ" },
  { base: "h", symbol: "ᜑ" },
  { base: "b", symbol: "ᜊ" },
  { base: "g", symbol: "ᜄ" },
  { base: "s", symbol: "ᜐ" },
  { base: "d", symbol: "ᜇ" },
  { base: "t", symbol: "ᜆ" },
  { base: "ng", symbol: "ᜅ" },
  { base: "w", symbol: "ᜏ" },
  { base: "l", symbol: "ᜎ" },
  { base: "m", symbol: "ᜋ" },
  { base: "y", symbol: "ᜌ" },
];

const vowelForms: Record<string, { ei: string, ou: string }> = {
  b: { ei: "be/bi", ou: "bo/bu" },
  g: { ei: "ge/gi", ou: "go/gu" },
  k: { ei: "ke/ki", ou: "ko/ku" },
  t: { ei: "te/ti", ou: "to/tu" },
  d: { ei: "de/di", ou: "do/du" },
  p: { ei: "pe/pi", ou: "po/pu" },
  n: { ei: "ne/ni", ou: "no/nu" },
  h: { ei: "he/hi", ou: "ho/hu" },
  s: { ei: "se/si", ou: "so/su" },
  ng: { ei: "nge/ngi", ou: "ngo/ngu" },
  w: { ei: "we/wi", ou: "wo/wu" },
  l: { ei: "le/li", ou: "lo/lu" },
  m: { ei: "me/mi", ou: "mo/mu" },
  y: { ei: "ye/yi", ou: "yo/yu" },
};

// For multiple-choice quiz characters (directly rendered with markers)
export const generateMcqCharacters = (): CharacterData[] => {
  const vowelMarkers = [
    { suffix: "ᜒ", variant: "ei" },
    { suffix: "ᜓ", variant: "ou" },
    { suffix: "᜔", variant: "consonant" }, // consonant only
  ];

  return BAYBAYIN_BASES.flatMap(({ symbol, base }) =>
    vowelMarkers.map(({ suffix, variant }) => {
      let expected = "";
      let label = "";

      if (variant === "consonant") {
        expected = base;
        label = base.toUpperCase();
      } else if (vowelForms[base]) {
        expected = vowelForms[base][variant as "ei" | "ou"];
        label = vowelForms[base][variant as "ei" | "ou"].toUpperCase();
      } else {
        expected = base;
        label = base.toUpperCase();
      }

      return {
        symbol: symbol + suffix,
        expected,
        label,
      };
    })
  );
};


// For drag-based quiz (requires dropping markers on base symbols)
export const generateDragCharacters = (): CharacterData[] => {
  return BAYBAYIN_BASES.flatMap(({ symbol, base }) => [
    {
      symbol,
      expected: `${base}e/${base}i`,
      label: `${base.toUpperCase()}E/${base.toUpperCase()}I`,
      correctMarker: "Kudlit",
      correctDrop: "top",
    },
    {
      symbol,
      expected: `${base}o/${base}u`,
      label: `${base.toUpperCase()}O/${base.toUpperCase()}U`,
      correctMarker: "Kudlit",
      correctDrop: "bottom",
    },
    {
      symbol,
      expected: base,
      label: base.toUpperCase(),
      correctMarker: "Plus",
      correctDrop: "bottom",
    },
  ]);
};

// Usage
export const MCQ_CHARACTERS: CharacterData[] = generateMcqCharacters();
export const DRAG_CHARACTERS: CharacterData[] = generateDragCharacters();

type QuestionType = "mcq" | "drag";

type Question = {
  type: QuestionType;
  character: CharacterData;
  options?: string[];
  pointsLeft: number;
  attempted: boolean;
};

type AnswerSummary = {
  symbol: string;
  label: string;
  type: QuestionType;
  expected: string;
  result: "correct" | "wrong";
  pointsEarned: number;
};

export default function Quiz({
  characters = [...MCQ_CHARACTERS, ...DRAG_CHARACTERS],
  modelName,
}: {
  characters: CharacterData[];
  lessonId: string;
  modelName?: string;
}) {
  const router = useRouter();
  const { user } = useUser();
  const startTime = useRef(Date.now());

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
    const [hearts, setHearts] = useState<number>(3);
  const [answerLog, setAnswerLog] = useState<AnswerSummary[]>([]);
  const [dragKey, setDragKey] = useState(Date.now());
  const [droppedZone, setDroppedZone] = useState<"top" | "bottom" | null>(null);
  const [droppedMarker, setDroppedMarker] = useState<"Kudlit" | "Plus" | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [sessionId] = useState(() => Date.now().toString());

  const convex = useConvex();

  const recordAttempt = useMutation(api.quiz.recordQuizAttempt);
  const recordSingleAnswer = useMutation(api.quiz.recordSingleAnswer);
  const saveProgress = useMutation(api.user_lesson_progress.saveProgress);
  const updateXp = useMutation(api.users.updateUserStats);
  const deleteUnfinishedAnswers = useMutation(api.quiz.deleteUnfinishedAnswers);

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: user?.id || "",
  });

  const pastAttempts = useQuery(
    api.quiz.getAttemptsForLesson,
    convexUserId ? { userId: convexUserId, lessonId: "jx71t9nq18esz01frqwe6af9xn7md24g" } : "skip"
  );

useEffect(() => {
  // Select 3 random characters from each type
  const mcqBase = shuffleArray(MCQ_CHARACTERS).slice(0, 3);
  const dragBase = shuffleArray(DRAG_CHARACTERS).slice(0, 3);

  // Duplicate each so they appear twice
  const mcqChars = [...mcqBase, ...mcqBase];
  const dragChars = [...dragBase, ...dragBase];

  const mcqQuestions: Question[] = mcqChars.map((char) => ({
    type: "mcq" as const,
    character: char,
    options: generateMCQOptions(char.expected, MCQ_CHARACTERS),
    pointsLeft: 10,
    attempted: false,
  }));

  const dragQuestions: Question[] = dragChars.map((char) => ({
    type: "drag",
    character: char,
    pointsLeft: 15,
    attempted: false,
  }));

  const total = [...mcqQuestions, ...dragQuestions];
  setQuestions(shuffleArray(total));
  setTotalQuestions(total.length);
}, []);

  const handleExitQuiz = () => {
    Alert.alert(
      "Leave Quiz?",
      "Your progress will be lost. Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            if (convexUserId) {
              await deleteUnfinishedAnswers({
                userId: convexUserId,
                lessonId: "jx71t9nq18esz01frqwe6af9xn7md24g",
                sessionId,
              });
            }
            router.back();
          },
        },
      ]
    );
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleExitQuiz
    );
    return () => backHandler.remove();
  }, []);

  const normalize = (s: string) => s.toLowerCase().replace(/[_\s\/]/g, "");

const generateMCQOptions = (answer: string, pool: CharacterData[]): string[] => {
  const allAnswers = Array.from(new Set(MCQ_CHARACTERS.map((c) => c.expected)));
  const distractors = shuffleArray(allAnswers.filter((a) => a !== answer)).slice(0, 2); // only 2 distractors
  return shuffleArray([answer, ...distractors]);
};

  const handleAnswer = async (isCorrect: boolean) => {
    const q = questions[currentIndex];
    const updated = [...questions];
    const gained = isCorrect ? q.pointsLeft : 0;

    const answer: AnswerSummary = {
      symbol: q.character.symbol,
      label: q.character.label,
      type: q.type,
      expected: q.character.expected,
      result: isCorrect ? "correct" : "wrong",
      pointsEarned: gained,
    };

    if (user && convexUserId) {
      await recordSingleAnswer({
        userId: convexUserId,
        lessonId: "jx71t9nq18esz01frqwe6af9xn7md24g",
        sessionId,
        ...answer,
        createdAt: Date.now(),
      });
    }

    const newLog = [...answerLog, answer];

    if (isCorrect) {
      updated.splice(currentIndex, 1);
    } else {
      const penalty = q.type === "mcq" ? 2 : 3;
      q.pointsLeft = Math.max(0, q.pointsLeft - penalty);
      q.attempted = true;
      setHearts((prev) => Math.max(0, prev - 1));

      if (q.pointsLeft <= 0) {
        updated.splice(currentIndex, 1);
      } else {
        updated.splice(currentIndex, 1);
        const insertAt = getRandomInt(currentIndex + 1, updated.length + 1);
        updated.splice(insertAt, 0, q);
      }
    }

    setQuestions(updated);
    setAnswerLog(newLog);
    setDroppedMarker(null);
    setDroppedZone(null);
    setDragKey(Date.now());
    setShowWrong(false);

    const newHearts = hearts - (isCorrect ? 0 : 1);

    if (updated.length === 0 || newHearts <= 0) {
      await finishQuiz(newLog, newHearts <= 0);

    } else {
      setCurrentIndex(Math.min(currentIndex, updated.length - 1));
    }
  };

  const finishQuiz = async (finalLog: AnswerSummary[], isGameOver = false) => {
    const totalPoints = finalLog.reduce((sum, a) => sum + a.pointsEarned, 0);
    const correctAnswers = finalLog.filter((a) => a.result === "correct").length;
    const maxPoints = 150;

    const stars =
      totalPoints >= maxPoints ? 3 :
      totalPoints >= maxPoints * 0.75 ? 2 : 1;

    if (!user || !convexUserId || pastAttempts === undefined) return;

    const isRetake = pastAttempts.length > 0;
    const attemptNumber = pastAttempts.length + 1;
    const heartsUsedCount = 3 - hearts;

      // 🎯 BADGE CHECK
      const newlyAwardedBadges: string[] = [];
      if (heartsUsedCount === 0) {
        newlyAwardedBadges.push("Perfectionist");
      }

    await recordAttempt({
      userId: convexUserId,
      lessonId: "jx71t9nq18esz01frqwe6af9xn7md24g",
      score: totalPoints,
      totalQuestions: finalLog.length,
      correctAnswers,
      earnedStars: stars,
      answers: finalLog,
      createdAt: Date.now(),
      timeSpent: Date.now() - startTime.current,
      isRetake,
      attemptNumber,
      heartsUsed: heartsUsedCount,
    });

    await saveProgress({
      userId: convexUserId,
      lessonId: "jx71t9nq18esz01frqwe6af9xn7md24g",
      score: totalPoints,
      stars,
    });

    await updateXp({
      clerkId: user.id,
      totalXP: totalPoints,
      lastActive: Date.now(),
    });

    router.replace({
      pathname: "/quiz/results",
      params: {
        stars: stars.toString(),
        score: totalPoints.toString(),
        lessonRoute: "kudlit_quiz",
        answers: encodeURIComponent(JSON.stringify(finalLog)),
        badges: encodeURIComponent(JSON.stringify(newlyAwardedBadges)),
        gameOver: isGameOver ? "true" : "false",
      },
    });
  };

  const renderQuestion = () => {
    const current = questions[currentIndex];
    if (!current) return null;

    if (current.type === "mcq") {
      return (
        <View>
          <Text style={styles.question}>{current.character.symbol}</Text>
          {current.options!.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.option}
              onPress={async () => {
                const isCorrect = option === current.character.expected;
                try {
                  await playSound(isCorrect ? 'correct' : 'wrong');
                } catch (err) {
                  console.error('Error playing sound:', err);
                }
                handleAnswer(isCorrect);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      const handleDrop = async (zone: "top" | "bottom", data: { title?: string }) => {
        if (!data?.title) return;

        const marker = data.title as "Kudlit" | "Plus";
        const isCorrect =
          marker === current.character.correctMarker &&
          zone === current.character.correctDrop;

        // Play sound first
        await playSound(isCorrect ? "correct" : "wrong");

        setDroppedZone(zone);
        setDroppedMarker(marker);
        setShowWrong(!isCorrect); // red if wrong

        // Reset visual feedback after a short delay
        setTimeout(() => {
          setDragKey(Date.now());
          setDroppedZone(null);
          setDroppedMarker(null);
          setShowWrong(false);
        }, 700);

        handleAnswer(isCorrect); // record the answer
      };

return (
  <GestureHandlerRootView>
    <DropProvider>
      <View style={styles.questionContainer}>
        <Text style={styles.lessonText}>Drag correct marker for {current.character.label}</Text>

        <View style={styles.characterStack}>
          <Droppable
            key="top-zone"
            onDrop={(data) => handleDrop("top", data as { title?: string })}
            style={styles.droppable}
          >
            <View
              style={[
                styles.dropZone,
                droppedZone === "top" && droppedMarker
                  ? showWrong
                    ? styles.dropZoneWrong
                    : styles.dropZoneCorrect
                  : {},
              ]}
            />
          </Droppable>

          <Text style={styles.bigCharacter}>{current.character.symbol}</Text>

          <Droppable
            key="bottom-zone"
            onDrop={(data) => handleDrop("bottom", data as { title?: string })}
            style={styles.droppable}
          >
            <View
              style={[
                styles.dropZone,
                showWrong && droppedZone === "bottom" && styles.dropZoneWrong,
                !showWrong && droppedZone === "bottom" && styles.dropZoneCorrect,
              ]}
            />
          </Droppable>
        </View>

        <View style={styles.draggableRow}>
          <Draggable<{ title: "Kudlit" }>
            key={dragKey + "-kudlit"}
            data={{ title: "Kudlit" }}
          >
            <View
              style={[
                styles.draggableItem,
                {
                  borderColor:
                    droppedMarker === "Kudlit" && !showWrong
                      ? "green"
                      : Colors.PRIMARY,
                },
              ]}
            >
              <Text style={styles.itemText}>•</Text>
            </View>
          </Draggable>

          <Draggable<{ title: "Plus" }>
            key={dragKey + "-plus"}
            data={{ title: "Plus" }}
          >
            <View
              style={[
                styles.draggableItem,
                {
                  borderColor:
                    droppedMarker === "Plus" && !showWrong
                      ? "green"
                      : Colors.PRIMARY,
                },
              ]}
            >
              <Text style={styles.plusItemText}>+</Text>
            </View>
          </Draggable>
        </View>
      </View>
    </DropProvider>
  </GestureHandlerRootView>
);
    }
  };

  const correctAnswersCount = answerLog.filter(a => a.result === "correct").length;

  const progress = correctAnswersCount / totalQuestions;

  if (!user || !convexUserId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Exit Button */}
      <TouchableOpacity
        style={styles.exitButton}
        onPress={async () => {
          await playSound('click');
          handleExitQuiz();
        }}
      >
        <Ionicons name="close" size={28} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <View style={styles.heartsContainer}>
        <View style={styles.hearts}>
          {[...Array(3)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < hearts ? "heart" : "heart-outline"}
              size={24}
              color={i < hearts ? Colors.HEART : Colors.HEART_EMPTY}
              style={{ marginHorizontal: 2 }}
            />
          ))}
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <Svg height="10" width="100%">
          <Rect x="0" y="0" width="100%" height="10" fill="#eee" rx="5" ry="5" />
          <Rect x="0" y="0" width={`${progress * 100}%`} height="10" fill={Colors.PRIMARY} rx="5" ry="5" />
        </Svg>
      </View>

      <Text style={styles.points}>
        Points: {answerLog.reduce((sum, a) => sum + a.pointsEarned, 0)}
      </Text>

      {renderQuestion()}
    </SafeAreaView>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lessonText: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
},
  bigCharacter: {
  fontSize: 250,
  color: Colors.PRIMARY,
  textAlign: "center",
  lineHeight: 210,
  includeFontPadding: false,
  marginTop: -30,
},
  heartsContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  hearts: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  question: {
    fontFamily: "outfit-bold",
    fontSize: 40,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.PRIMARY,
  },
  option: {
    fontFamily: "outfit",
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: {
    fontFamily: "outfit",
    fontSize: 18,
    textAlign: "center",
    color: "white"
  },
  points: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  questionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  characterStack: {
    alignItems: "center",
    marginBottom: 30,
  },
  draggableRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
draggableItem: {
  height: 61,
  width: 61,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.WHITE,
  borderRadius: 10,
  borderWidth: 2,
},
itemText: {
  color: Colors.PRIMARY,
  fontSize: 70,
  textAlign: "center",
  lineHeight: 61,
  includeFontPadding: false,
  textAlignVertical: "center",
},
plusItemText: {
  color: Colors.PRIMARY,
  fontSize: 50,
  fontWeight: "bold",
  textAlign: "center",
  lineHeight: 23,
  includeFontPadding: false,
  textAlignVertical: "center",
},
dropZone: {
  flex: 1,
  borderColor: Colors.PRIMARY,
  borderWidth: 2,
  borderStyle: "dashed",
  borderRadius: 10,
  backgroundColor: Colors.GREY_LIGHT,
  height: 60,
  width: 60,
},
  dropZoneCorrect: {
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 8,
    height: 60,
    marginVertical: 10,
  },
  dropZoneWrong: {
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "rgba(255,0,0,0.1)",
    borderRadius: 8,
    height: 60,
    marginVertical: 10,
  },
  droppable: {
    height: 60,
    width: 60,
  },
  exitButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
});