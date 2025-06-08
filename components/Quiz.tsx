// components/Quiz.tsx
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import Colors from "../constants/Colors";
import { lessonRoutes } from "../constants/LessonRoutes";
import { api } from "../convex/_generated/api";


// Define allowed difficulty levels
type Difficulty = "basic" | "kudlit" | "word" | "sentence";

const difficultyScoreMap: Record<Difficulty, number> = {
  basic: 10,
  kudlit: 15,
  word: 20,
  sentence: 25,
};

type QuizProps = {
  lessonId: string;
};

export default function Quiz({ lessonId }: QuizProps) {
  const { userId } = useAuth();
  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: userId ?? "",
  });

  const questions = useQuery(api.questions.getRandomQuestionsByLesson, {
    lessonId: lessonId as any,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showFeedback, setShowFeedback] = useState(false);

    useFocusEffect(
    useCallback(() => {
      // Reset all state on focus
      setCurrentIndex(0);
      setSelected(null);
      setAnswers({});
      setShowFeedback(false);
    }, [])
  );


  const router = useRouter();
  const saveAttempt = useMutation(api.userAttempts.saveAttempt);

  if (!convexUserId || !questions || questions.length === 0 || !questions[currentIndex]) {
    return (
      <View style={styles.center}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctAnswer = currentQuestion.correctAnswerIndex;
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  const handleOptionSelect = (index: number) => {
    setSelected(index);
    setShowFeedback(true);
    setAnswers((prev) => ({ ...prev, [currentQuestion._id]: index }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const nextQuestion = questions[nextIndex];
      const savedAnswer = answers[nextQuestion._id];

      setSelected(savedAnswer ?? null);
      setShowFeedback(savedAnswer !== undefined);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      const prevQuestion = questions[prevIndex];
      const savedAnswer = answers[prevQuestion._id];

      setSelected(savedAnswer ?? null);
      setShowFeedback(savedAnswer !== undefined);
    }
  };

  const progress = (currentIndex + 1) / questions.length;

  const handleFinishQuiz = async () => {
    let score = 0;

    Object.entries(answers).forEach(([questionId, selectedIndex]) => {
      const q = questions.find((q) => q._id === questionId);
      const isCorrect = q?.correctAnswerIndex === selectedIndex;
      const rawDifficulty = q?.difficulty ?? "basic";

      const difficulty: Difficulty = ["basic", "kudlit", "word", "sentence"].includes(rawDifficulty)
        ? (rawDifficulty as Difficulty)
        : "basic";

      if (isCorrect) {
        score += difficultyScoreMap[difficulty];
      }
    });

    const correct = Object.entries(answers).filter(([questionId, selectedIndex]) => {
      const q = questions.find((q) => q._id === questionId);
      return q?.correctAnswerIndex === selectedIndex;
    }).length;

    const total = questions.length;

    const routeName = lessonRoutes[lessonId];

    await saveAttempt({
      userId: convexUserId,
      lessonId: lessonId as any, // Cast to any if you are sure lessonId is valid, or use the actual Id<"lessons"> type if available
      answers,
      totalQuestions: total,
      correctAnswers: correct,
      score,
      createdAt: new Date().toISOString(),
    });

    const lessonRoute = lessonRoutes[lessonId];

    router.push({
      pathname: "/quiz/results",
      params: {
        correct: correct.toString(),
        total: total.toString(),
        score: score.toString(),
        lessonRoute: lessonRoute,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={null}
        color={Colors.PRIMARY}
        unfilledColor="#eee"
        borderWidth={0}
        height={8}
        animated
        animationType="timing"
        animationConfig={{ duration: 300 }}
        style={{ marginBottom: 16 }}
      />

      <Text style={styles.progressText}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <Text style={styles.questionText}>
        {currentIndex + 1}. {currentQuestion.questionText}
      </Text>

      {currentQuestion.options.map((option, i) => {
        const isSelected = selected === i;
        const isCorrect = i === correctAnswer;
        const showColor = showFeedback && isSelected;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => handleOptionSelect(i)}
            style={[
              styles.optionButton,
              showColor && isCorrect && styles.correctOption,
              showColor && !isCorrect && styles.wrongOption,
            ]}
            disabled={showFeedback}
          >
            <Text
              style={[
                styles.optionText,
                showColor && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}

      {showFeedback && (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.backButton, isFirst && { opacity: 0.3 }]}
            disabled={isFirst}
            onPress={handleBack}
          >
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={isLast ? handleFinishQuiz : handleNext}
            disabled={!showFeedback}
          >
            <Text style={styles.navText}>{isLast ? "Finish" : "Next"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.BLACK,
    marginBottom: 20,
  },
  optionButton: {
    padding: 14,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.BLACK,
  },
  optionTextSelected: {
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
  correctOption: {
    backgroundColor: "#28a745",
  },
  wrongOption: {
    backgroundColor: "#dc3545",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  backButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.GRAY,
    minWidth: 100,
    alignItems: "center",
  },
  nextButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    minWidth: 100,
    alignItems: "center",
  },
  navText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});
