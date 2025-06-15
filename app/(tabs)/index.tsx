import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

// Custom layout with (x, y) positions
const LESSONS = [ // static for now, must update real-time depending on user progress
  { id: 1, title: "Lesson 1", status: "unlocked", path: "/lessons/lesson-1", x: 160, y: 5 },
  { id: 2, title: "Lesson 2", status: "locked", path: "/lessons/lesson-2", x: 260, y: 140 },
  { id: 3, title: "Lesson 3", status: "locked", path: "/lessons/lesson-3", x: 60, y: 240 },
  { id: 4, title: "Lesson 4", status: "locked", path: "/lessons/lesson-4", x: 60, y: 400 },
  { id: 5, title: "Lesson 5", status: "locked", path: "/lessons/lesson-5", x: 260, y: 480 },
];

const TILE_SIZE = 80;
const MAP_HEIGHT = 600;
const PROGRESS_SIZE = 60;
const STROKE_WIDTH = 6;
const RADIUS = (PROGRESS_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function LessonMap() {
  const router = useRouter();

  const completedCount = LESSONS.filter((l) => l.status === "completed").length;
  const progress = completedCount / LESSONS.length;

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

      {/* Path and Tiles */}
      <View style={styles.pathContainer}>
        <Svg height={MAP_HEIGHT} width="100%" style={StyleSheet.absoluteFill}>
          {LESSONS.map((_, index) => {
            if (index === LESSONS.length - 1) return null;

            const curr = LESSONS[index];
            const next = LESSONS[index + 1];

            const startX = curr.x + TILE_SIZE / 2;
            const startY = curr.y + TILE_SIZE / 2;

            const endX = next.x + TILE_SIZE / 2;
            const endY = next.y + TILE_SIZE / 2;

            return (
              <Path
                key={index}
                d={`M${startX},${startY} L${startX},${endY} L${endX},${endY}`}
                stroke="#ccc"
                strokeWidth={3}
                fill="none"
              />
            );
          })}
        </Svg>

        {LESSONS.map((lesson) => (
          <View
            key={lesson.id}
            style={[
              styles.nodeWrapper,
              {
                top: lesson.y,
                left: lesson.x,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={lesson.status === "unlocked" ? 0.7 : 1}
              onPress={() =>
                lesson.status === "unlocked" ? router.push(lesson.path as any) : null
              }
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
    paddingBottom: 96,
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
