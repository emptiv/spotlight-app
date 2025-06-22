import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Rect } from "react-native-svg";

type CharacterData = {
  symbol: string;
  expected: string;
  label: string;
  modelName?: string;
};

type QuestionType = "mcq" | "writing";

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
  characters,
  lessonId,
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
  const [answerLog, setAnswerLog] = useState<AnswerSummary[]>([]);

  const recordAttempt = useMutation(api.quiz.recordQuizAttempt);
  const recordSingleAnswer = useMutation(api.quiz.recordSingleAnswer);
  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: user?.id || "",
  });

  const pastAttempts = useQuery(
    api.quiz.getAttemptsForLesson,
    convexUserId
      ? { userId: convexUserId, lessonId }
      : "skip"
  );

  useEffect(() => {
    const generated = characters.flatMap((char) => {
      const mcq: Question = {
        type: "mcq",
        character: char,
        options: generateMCQOptions(char.expected),
        pointsLeft: 10,
        attempted: false,
      };

      const writing: Question = {
        type: "writing",
        character: char,
        pointsLeft: 15,
        attempted: false,
      };

      return [mcq, writing, { ...mcq }, { ...writing }];
    });

    setQuestions(shuffleArray(generated));
  }, []);

  const normalize = (s: string) => s.toLowerCase().replace(/[_\s\/]/g, "");

  const generateMCQOptions = (answer: string): string[] => {
    const all = characters.map((c) => c.expected);
    const distractors = shuffleArray(all.filter((o) => o !== answer)).slice(0, 3);
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
        lessonId,
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

    if (updated.length === 0) {
      await finishQuiz(newLog);
    } else {
      setCurrentIndex(Math.min(currentIndex, updated.length - 1));
    }
  };

  const finishQuiz = async (finalLog: AnswerSummary[]) => {
    const totalPoints = finalLog.reduce((sum, a) => sum + a.pointsEarned, 0);
    const correctAnswers = finalLog.filter((a) => a.result === "correct").length;
    const maxPoints = characters.length * (10 + 15) * 2;

    const stars =
      totalPoints >= maxPoints ? 3 :
      totalPoints >= maxPoints * 0.75 ? 2 : 1;

    if (!user || !convexUserId || pastAttempts === undefined) return;

    const isRetake = pastAttempts.length > 0;
    const attemptNumber = pastAttempts.length + 1;

    await recordAttempt({
      userId: convexUserId,
      lessonId,
      score: totalPoints,
      totalQuestions: finalLog.length,
      correctAnswers,
      earnedStars: stars,
      answers: finalLog,
      createdAt: Date.now(),
      timeSpent: Date.now() - startTime.current,
      isRetake,
      attemptNumber,
    });

    router.replace({
      pathname: "/quiz/results",
      params: {
        stars: stars.toString(),
        score: totalPoints.toString(),
        lessonRoute: modelName,
        answers: encodeURIComponent(JSON.stringify(finalLog)),
      },
    });
  };

  const renderQuestion = () => {
    const current = questions[currentIndex];
    if (!current) return null;

    if (current.type === "mcq") {
      return (
        <View>
          <Text style={styles.question}>
            {current.character.symbol}
          </Text>
          {current.options!.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.option}
              onPress={() =>
                handleAnswer(option === current.character.expected)
              }
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.question}>
            Write {current.character.label}
          </Text>
          <HandwritingCanvas
            key={`${currentIndex}-${answerLog.length}`}
            lesson={current.character.modelName || modelName}
            showGuide={false}
            onPrediction={(prediction) => {
              const isCorrect =
                normalize(prediction) === normalize(current.character.expected);
              handleAnswer(isCorrect);
            }}
            onClear={() => {}}
          />
        </View>
      );
    }
  };

  const progress = answerLog.length / (characters.length * 4);

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
      {/* SVG Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Svg height="10" width="100%">
          <Rect
            x="0"
            y="0"
            width="100%"
            height="10"
            fill="#eee"
            rx="5"
            ry="5"
          />
          <Rect
            x="0"
            y="0"
            width={`${progress * 100}%`}
            height="10"
            fill={Colors.PRIMARY}
            rx="5"
            ry="5"
          />
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
});
