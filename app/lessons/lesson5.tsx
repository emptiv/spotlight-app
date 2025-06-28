import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LESSON_ID = "jx7aznjdjmag8g7v2v7w7mavtn7jbf9p";
const BASE_MODEL_NAME = "lesson5";

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
].map((char) => ({
  ...char,
  modelName: BASE_MODEL_NAME,}));

export default function Lesson5() {
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
        lessonSlug="lesson5"
        nextScreen="/quiz/lesson5"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      key={`${convexUserId}-${LESSON_ID}-${progress.bestScore}-${progress.bestStars}`}
      lessonId="5"
      bestScore={progress.bestScore}
      bestStars={progress.bestStars}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() =>
        router.push({
          pathname: "/quiz/[lessonRoute]",
          params: {
            lessonRoute: "lesson5",
            refreshFromLesson: "5",
          },
        })
      }
    />
  );
}
