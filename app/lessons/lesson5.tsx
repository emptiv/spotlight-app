import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useRouter } from "expo-router";
import { useState } from "react";

const characters = [
  {
    symbol: "ᜅ",
    expected: "nga",
    label: "NGA",
    guideImage: require("@/assets/guides/nga.png"),
  },
  {
    symbol: "ᜏ",
    expected: "wa",
    label: "WA",
    guideImage: require("@/assets/guides/wa.png"),
  },
  {
    symbol: "ᜎ",
    expected: "la",
    label: "LA",
    guideImage: require("@/assets/guides/la.png"),
  },
];

export default function Lesson5() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const router = useRouter();

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson5"
        nextScreen="/quiz/lesson5"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      lessonId="5"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => router.replace("/quiz/lesson5" as any)}
    />
  );
}
