import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useRouter } from "expo-router";
import { useState } from "react";

const characters = [
  {
    symbol: "ᜐ",
    expected: "sa",
    label: "SA",
    guideImage: require("@/assets/guides/sa.png"),
  },
  {
    symbol: "ᜇ",
    expected: "da_ra",
    label: "DA/RA",
    guideImage: require("@/assets/guides/dara.png"),
  },
  {
    symbol: "ᜆ",
    expected: "ta",
    label: "TA",
    guideImage: require("@/assets/guides/ta.png"),
  },
];

export default function Lesson4() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const router = useRouter();

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson4"
        nextScreen="/quiz/lesson4"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      lessonId="4"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => router.replace("/quiz/lesson4" as any)}
    />
  );
}
