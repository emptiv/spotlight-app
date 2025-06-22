import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useRouter } from "expo-router";
import { useState } from "react";

const characters = [
  {
    symbol: "ᜑ",
    expected: "ha",
    label: "HA",
    guideImage: require("@/assets/guides/ha.png"),
  },
  {
    symbol: "ᜊ",
    expected: "ba",
    label: "BA",
    guideImage: require("@/assets/guides/ba.png"),
  },
  {
    symbol: "ᜄ",
    expected: "ga",
    label: "GA",
    guideImage: require("@/assets/guides/ga.png"),
  },
];

export default function Lesson3() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const router = useRouter();

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson3"
        nextScreen="/quiz/lesson3"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      lessonId="3"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => router.replace("/quiz/lesson3" as any)}
    />
  );
}
