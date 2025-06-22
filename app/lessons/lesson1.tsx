import QuizLesson1 from "@/app/quiz/q-lesson-1"; // Import your quiz screen directly
import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useState } from "react";

const characters = [
  {
    symbol: "ᜀ",
    expected: "a",
    label: "A",
    guideImage: require("@/assets/guides/a.png"),
  },
  {
    symbol: "ᜁ",
    expected: "e_i",
    label: "E/I",
    guideImage: require("@/assets/guides/ei.png"),
  },
  {
    symbol: "ᜂ",
    expected: "o_u",
    label: "O/U",
    guideImage: require("@/assets/guides/ou.png"),
  },
];

export default function Lesson1() {
  const [screen, setScreen] = useState<"overview" | "study" | "quiz">("overview");

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson1"
        nextScreen="/quiz/q-lesson-1"
        characters={characters}
      />
    );
  }

  if (screen === "quiz") {
    return <QuizLesson1 />;
  }

  return (
    <LessonOverviewScreen
      lessonId="1"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => setScreen("quiz")} // 🔓 Bypassing lock here
    />
  );
}
