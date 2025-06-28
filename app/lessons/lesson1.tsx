import LessonOverviewScreen from "@/components/LessonOverview";
import LessonScreen from "@/components/StudyScreen";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LESSON_ID = "jx72aewjef2n2jzw5ajht6b32s7jb6bm";
const BASE_MODEL_NAME = "lesson1";

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
].map((char) => ({
  ...char,
  modelName: BASE_MODEL_NAME,}));

export default function Lesson1() {
  const [screen, setScreen] = useState<"overview" | "study">("overview");
  const [progress, setProgress] = useState<{ bestScore: number; bestStars: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const convex = useConvex();

  // ✅ Get the Convex user ID from Clerk ID
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
        lessonSlug="lesson1"
        nextScreen="/quiz/lesson1"
        characters={characters}
      />
    );
  }

  return (
    <LessonOverviewScreen
      key={`${convexUserId}-${LESSON_ID}-${progress.bestScore}-${progress.bestStars}`}
      lessonId="1"
      bestScore={progress.bestScore}
      bestStars={progress.bestStars}
      characters={characters.map(({ symbol, label }) => ({ symbol, label }))}
      onStudyPress={() => setScreen("study")}
      onQuizPress={() => {
        router.push({
          pathname: "/quiz/[lessonRoute]",
          params: {
            lessonRoute: "lesson1",
            refreshFromLesson: "1",
          },
        });
      }}
    />
  );
}
