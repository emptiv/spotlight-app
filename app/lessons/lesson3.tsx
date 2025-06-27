import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LESSON_ID = "jx7fgkbfxajnghpcgf9ebjhjdd7jb9s1";

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
  const [progress, setProgress] = useState<{ bestScore: number; bestStars: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const convex = useConvex();

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: clerkUserId ?? "",
  });

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
