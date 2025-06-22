import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { useRouter } from "expo-router";
import { useState } from "react";

const characters = [
  {
    symbol: "ᜉ",
    expected: "pa",
    label: "PA",
    guideImage: require("@/assets/guides/pa.png"),
    modelName: "lessonx"
  },
  {
    symbol: "ᜃ",
    expected: "ka",
    label: "KA",
    guideImage: require("@/assets/guides/ka.png"),
  },
  {
    symbol: "ᜈ",
    expected: "na",
    label: "NA",
    guideImage: require("@/assets/guides/na.png"),
  },
];

export default function Lesson2() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const router = useRouter();

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId="lesson2"
        nextScreen="/quiz/lesson2"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      lessonId="2"
      bestScore={0}
      bestStars={0}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => router.replace("/quiz/lesson2" as any)}
    />
  );
}
