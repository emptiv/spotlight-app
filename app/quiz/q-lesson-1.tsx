import Quiz from "@/components/Quiz";
import React from "react";

const characters = [
  {
    symbol: "ᜀ",
    expected: "a",
    label: "A",
  },
  {
    symbol: "ᜁ",
    expected: "e_i",
    label: "E/I",
  },
  {
    symbol: "ᜂ",
    expected: "o_u",
    label: "O/U",
  },
];

export default function QuizLesson1() {
  const lessonId = "jx72aewjef2n2jzw5ajht6b32s7jb6bm"; // used for Convex
  const modelName = "lesson1"; // used for handwriting prediction

  const handleComplete = (stars: number, score: number) => {
    console.log(`Quiz completed with ${stars} stars and score ${score}`);
  };

  return (
    <Quiz
      lessonId={lessonId}
      modelName={modelName}
      characters={characters}
      onComplete={handleComplete}
    />
  );
}
