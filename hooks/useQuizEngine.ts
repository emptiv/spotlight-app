import { useState } from "react";

type Question = {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  type: "mcq" | "writing";
  character?: string;
};

type AnswerType = "mcq" | "writing";

type QuizResult = {
  questionId: string;
  isCorrect: boolean;
  type: AnswerType;
};

export const useQuizEngine = (questions: Question[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);

  const current = questions[currentIndex];

  const handleAnswer = (questionId: string, isCorrect: boolean, type: AnswerType) => {
    setResults((prev) => [
      ...prev,
      { questionId, isCorrect, type },
    ]);

    // Move to next question after slight delay (for feedback)
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  const isFinished = currentIndex >= questions.length;

  return {
    current,
    currentIndex,
    total: questions.length,
    handleAnswer,
    isFinished,
    results,
  };
};
