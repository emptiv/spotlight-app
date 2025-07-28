import LessonOverviewScreen from "@/components/LessonOverview";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LESSON_ID = "jx71t9nq18esz01frqwe6af9xn7md24g";

const characters = [
  { symbol: "ᜏᜒ", label: "KUDLIT (-E/I)" },
  { symbol: "ᜏᜓ", label: "KUDLIT (-O/U)" },
  { symbol: "ᜏ᜔", label: "KRUS-KUDLIT" },
];

export default function Lesson7() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<{ bestScore: number; bestStars: number } | null>(null);

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

  return (
    <LessonOverviewScreen
      key={`${convexUserId}-${LESSON_ID}-${progress.bestScore}-${progress.bestStars}`}
      lessonId="7"
      bestScore={progress.bestScore}
      bestStars={progress.bestStars}
      characters={characters}
      onStudyPress={() => router.push("/practice/kudlit")}
      onQuizPress={() =>
        router.push({
          pathname: "/quiz/[lessonRoute]",
          params: {
            lessonRoute: "kudlit_quiz",
            refreshFromLesson: "7",
          },
        })
      }
    />
  );
}
