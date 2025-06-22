import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useRouter } from "expo-router";
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
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const router = useRouter();

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson1"
        nextScreen="/quiz/lesson1"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      lessonId="1"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => router.replace("/quiz/lesson1" as any)}
    />
  );
}
