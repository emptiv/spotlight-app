import HandwritingCanvas from "@/components/HandwritingCanvas";
import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
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
};

type QuestionType = "mcq" | "writing";

type Question = {
  type: QuestionType;
  character: CharacterData;
  options?: string[];
  pointsLeft: number;
  attempted: boolean;
};

export default function Quiz({
  characters,
  lessonId,
  modelName,
  onComplete,
}: {
  characters: CharacterData[];
  lessonId: string;
  modelName: string;
  onComplete: (stars: number, score: number) => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswered, setCorrectAnswered] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const current = questions[currentIndex];

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

  const handleAnswer = (isCorrect: boolean) => {
    const q = questions[currentIndex];
    const updated = [...questions];

    if (isCorrect) {
      // Award points only on first correct
      if (!q.attempted) {
        const gain = q.type === "mcq" ? 10 : 15;
        setTotalPoints((p) => p + gain);
      }

      setCorrectAnswered((c) => c + 1);
      updated.splice(currentIndex, 1); // Remove question
    } else {
      // Deduct points
      const penalty = q.type === "mcq" ? 2 : 3;
      q.pointsLeft -= penalty;
      q.attempted = true;

      if (q.pointsLeft <= 0) {
        updated.splice(currentIndex, 1); // Remove completely
      } else {
        // Reinsert elsewhere to retry later
        updated.splice(currentIndex, 1);
        const insertAt = getRandomInt(currentIndex + 1, updated.length + 1);
        updated.splice(insertAt, 0, q);
      }
    }

    setQuestions(updated);

    if (updated.length === 0) {
      finishQuiz();
    } else {
      setCurrentIndex(Math.min(currentIndex, updated.length - 1));
    }
  };

  const finishQuiz = () => {
    const maxPoints = characters.length * (10 + 15) * 2; // each character: 2 MCQ + 2 Writing
    const stars =
      totalPoints >= maxPoints
        ? 3
        : totalPoints >= maxPoints * 0.75
        ? 2
        : 1;

    onComplete(stars, totalPoints);
  };

  const renderQuestion = () => {
    if (!current) return null;

    if (current.type === "mcq") {
      return (
        <View>
          <Text style={styles.question}>
            What is the syllabic for {current.character.symbol}?
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
            Write {current.character.symbol} ({current.character.label})
          </Text>
          <HandwritingCanvas
            key={`${currentIndex}-${correctAnswered}`}
            lesson={modelName}
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.progress}>
        Question {correctAnswered + 1}
      </Text>
      <Text style={styles.points}>Points: {totalPoints}</Text>
      {renderQuestion()}
    </SafeAreaView>
  );
}

// Helpers
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
  question: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.PRIMARY,
  },
  option: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
  },
  progress: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 16,
  },
  points: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
});
