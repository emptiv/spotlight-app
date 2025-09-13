import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LESSON_ID = "kd7eyxaya8hpwm4gq111a3y1157qc6t5";
const BASE_MODEL_NAME = "lesson3";

const characters = [
  {
    symbol: "ᜑ",
    expected: "ha",
    label: "HA",
    guideGIF: require("@/assets/guides/ha.gif"),
    guideImage: require("@/assets/guides/img/ha.png"),
    gifDuration: 2440,
  },
  {
    symbol: "ᜊ",
    expected: "ba",
    label: "BA",
    guideGIF: require("@/assets/guides/ba.gif"),
    guideImage: require("@/assets/guides/img/ba.png"),
    gifDuration: 4340,
  },
  {
    symbol: "ᜄ",
    expected: "ga",
    label: "GA",
    guideGIF: require("@/assets/guides/ga.gif"),
    guideImage: require("@/assets/guides/img/ga.png"),
    gifDuration: 4300,
  },
].map((char) => ({
  ...char,
  modelName: BASE_MODEL_NAME,}));

export default function Lesson3() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const [progress, setProgress] = useState<{ bestScore: number; bestStars: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const convex = useConvex();

  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  );

  const fetchProgress = useCallback(async () => {
    if (!convexUserId) return;

    try {
      setLoading(true);
      const result = await convex.query(api.user_lesson_progress.getProgress, {
        userId: convexUserId,
        lessonId: LESSON_ID,
      });
      setProgress(result);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
      setProgress({ bestScore: 0, bestStars: 0 });
    } finally {
      setLoading(false);
    }
  }, [convexUserId, convex]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useFocusEffect(
    useCallback(() => {
      fetchProgress();
    }, [fetchProgress])
  );

  if (!convexUserId || loading || !progress) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading lesson...</Text>
      </View>
    );
  }

  if (screen === "study") {
    return (
      <LessonScreen
        lessonId={LESSON_ID}
        lessonSlug="lesson3"
        nextScreen="/quiz/lesson3"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      key={`${convexUserId}-${LESSON_ID}-${progress.bestScore}-${progress.bestStars}`}
      lessonId="3"
      bestScore={progress.bestScore}
      bestStars={progress.bestStars}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() =>
        router.push({
          pathname: "/quiz/[lessonRoute]",
          params: {
            lessonRoute: "lesson3",
            refreshFromLesson: "3",
          },
        })
      }
    />
  );
}
