import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useRouter } from "expo-router";
import { useState } from "react";

const characters = [
  {
    symbol: "ᜋ",
    expected: "ma",
    label: "MA",
    guideImage: require("@/assets/guides/ma.png"),
  },
  {
    symbol: "ᜌ",
    expected: "ya",
    label: "YA",
    guideImage: require("@/assets/guides/ya.png"),
  },
];

export default function Lesson6() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const router = useRouter();

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson6"
        nextScreen="/quiz/lesson6"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      lessonId="6"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => router.replace("/quiz/lesson6" as any)}
    />
  );
}
