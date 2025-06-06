// components/Quiz.tsx
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import Colors from "../constants/Colors";
import { api } from "../convex/_generated/api";

type QuizProps = {
  lessonId: string;
};

export default function Quiz({ lessonId }: QuizProps) {
  const questions = useQuery(api.questions.getRandomQuestionsByLesson, {
    lessonId: lessonId as any,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  if (!questions) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
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
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    const nextQuestion = questions[nextIndex];
    const savedAnswer = answers[nextQuestion._id];

    setSelected(savedAnswer ?? null);
    setShowFeedback(savedAnswer !== undefined);
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);

    const prevQuestion = questions[prevIndex];
    const savedAnswer = answers[prevQuestion._id];

    setSelected(savedAnswer ?? null);
    setShowFeedback(savedAnswer !== undefined);
  };

  const progress = (currentIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={null}
        color={Colors.PRIMARY}
        unfilledColor="#eee"
        borderWidth={0}
        height={8}
        animated={true}
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
            onPress={handleNext}
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
