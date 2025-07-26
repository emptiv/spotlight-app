import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const LESSONS = [
  { id: "jx72aewjef2n2jzw5ajht6b32s7jb6bm", title: "Lesson 1", path: "/lessons/lesson1", x: 150, y: 4 },
  { id: "jx73gf6kgan5zd49zfjza2hyss7jamra", title: "Lesson 2", path: "/lessons/lesson2", x: 240, y: 140 },
  { id: "jx7fgkbfxajnghpcgf9ebjhjdd7jb9s1", title: "Lesson 3", path: "/lessons/lesson3", x: 60, y: 240 },
  { id: "jx75w094cp3g52bw137thd7fy57jbrn3", title: "Lesson 4", path: "/lessons/lesson4", x: 60, y: 400 },
  { id: "jx7aznjdjmag8g7v2v7w7mavtn7jbf9p", title: "Lesson 5", path: "/lessons/lesson5", x: 240, y: 400 },
  { id: "jx755h0x70cmbc38y6h4wjzss97jaae7", title: "Lesson 6", path: "/lessons/lesson6", x: 240, y: 580 },
  { id: "jx71t9nq18esz01frqwe6af9xn7md24g", title: "Lesson 7", path: "/lessons/lesson7", x: 240, y: 760 },
];

const TILE_SIZE = 80;
const MAP_HEIGHT = LESSONS[LESSONS.length - 1].y + TILE_SIZE + 50;
const PROGRESS_SIZE = 60;
const STROKE_WIDTH = 8;
const RADIUS = (PROGRESS_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LessonMap() {
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const convex = useConvex();

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: clerkUserId ?? "",
  });

  const fetchCompletedLessons = useCallback(async () => {
    if (!convexUserId) return;
    try {
      setLoading(true);
      const result = await convex.query(api.user_lesson_progress.getCompletedLessons, {
        userId: convexUserId,
      });
      const completedIds = Array.isArray(result) ? result : [];
      setCompletedLessons(completedIds);
    } catch (err) {
      console.error("Failed to fetch completed lessons:", err);
      setCompletedLessons([]);
    } finally {
      setLoading(false);
    }
  }, [convexUserId, convex]);

  useEffect(() => {
    fetchCompletedLessons();
  }, [fetchCompletedLessons]);

  useFocusEffect(
    useCallback(() => {
      fetchCompletedLessons();
    }, [fetchCompletedLessons])
  );

  if (!convexUserId || loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </ScrollView>
    );
  }

  const lessonsWithStatus = LESSONS.map((lesson, index) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const previousLesson = LESSONS[index - 1];
    const previousCompleted = index === 0 || (previousLesson && completedLessons.includes(previousLesson.id));

    const status = isCompleted
      ? "completed"
      : previousCompleted
      ? "unlocked"
      : "locked";

    return { ...lesson, status };
  });

  const completedCount = lessonsWithStatus.filter((l) => l.status === "completed").length;
  const progress = completedCount / lessonsWithStatus.length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.chapterCard}>
        <Text style={styles.chapterTitle}>The Letters of Baybayin</Text>
        <View style={styles.progressCircle}>
          <Svg width={PROGRESS_SIZE} height={PROGRESS_SIZE}>
            <Circle
              stroke="#eee"
              fill="none"
              cx={PROGRESS_SIZE / 2}
              cy={PROGRESS_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
            />
            <Circle
              stroke={Colors.PRIMARY}
              fill="none"
              cx={PROGRESS_SIZE / 2}
              cy={PROGRESS_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${PROGRESS_SIZE / 2}, ${PROGRESS_SIZE / 2}`}
            />
          </Svg>
          <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.pathContainer}>
        <Svg height={MAP_HEIGHT} width="100%" style={StyleSheet.absoluteFill}>
          {/* Background dots - fixed grid */}
          {Array.from({ length: Math.ceil(MAP_HEIGHT / 60) }).flatMap((_, row) =>
            Array.from({ length: 6 }).map((_, col) => {
              const x = 40 + col * 60;
              const y = 40 + row * 60;
              return (
                <Circle
                  key={`bg-${row}-${col}`}
                  cx={x}
                  cy={y}
                  r={4}
                  fill="rgba(0,0,0,0.05)"
                />
              );
            })
          )}

          {/* Paths between lessons */}
          {lessonsWithStatus.map((_, index) => {
            if (index === lessonsWithStatus.length - 1) return null;

            const curr = lessonsWithStatus[index];
            const next = lessonsWithStatus[index + 1];

            const startX = curr.x + TILE_SIZE / 2;
            const startY = curr.y + TILE_SIZE / 2;
            const endX = next.x + TILE_SIZE / 2;
            const endY = next.y + TILE_SIZE / 2;

            const isCompletedConnection =
              curr.status === "completed" && next.status === "completed";

            return (
              <Path
                key={`path-${index}`}
                d={`M${startX},${startY} L${startX},${endY} L${endX},${endY}`}
                stroke={isCompletedConnection ? "#83c985" : "#e3e3e3"}
                strokeWidth={17}
                fill="none"
              />
            );
          })}
        </Svg>

        {/* Lesson nodes */}
        {lessonsWithStatus.map((lesson) => (
          <View
            key={lesson.id}
            style={[styles.nodeWrapper, { top: lesson.y, left: lesson.x }]}
          >
            <TouchableOpacity
              activeOpacity={lesson.status !== "locked" ? 0.7 : 1}
              onPress={() => {
                if (lesson.status !== "locked") {
                  router.push(lesson.path as any);
                }
              }}
              style={[
                styles.tile,
                {
                  backgroundColor:
                    lesson.status === "completed"
                      ? Colors.SUCCESS
                      : lesson.status === "unlocked"
                      ? Colors.PRIMARY
                      : "#ccc",
                },
              ]}
            >
              <Ionicons
                name={
                  lesson.status === "completed"
                    ? "checkmark"
                    : lesson.status === "locked"
                    ? "lock-closed"
                    : "book"
                }
                size={24}
                color="white"
              />
              <Text style={styles.tileText}>{lesson.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 90,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    width: "85%",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  chapterTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  progressCircle: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  progressLabel: {
    position: "absolute",
    fontSize: 12,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
  pathContainer: {
    width: "100%",
    height: MAP_HEIGHT,
    position: "relative",
  },
  nodeWrapper: {
    position: "absolute",
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  tileText: {
    color: "white",
    fontSize: 12,
    fontFamily: "outfit",
    marginTop: 4,
    textAlign: "center",
  },
});
