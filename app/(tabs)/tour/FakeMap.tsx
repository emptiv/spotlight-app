// tourScreens/LessonMapUIWithHeader.tsx
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const LESSONS = [
  { id: "1", title: "Lesson 1", x: 100, y: 4, status: "completed" },
  { id: "2", title: "Lesson 2", x: 220, y: 140, status: "unlocked" },
  { id: "3", title: "Lesson 3", x: 60, y: 240, status: "locked" },
  { id: "4", title: "Lesson 4", x: 60, y: 400, status: "locked" },
  { id: "5", title: "Lesson 5", x: 220, y: 400, status: "locked" },
  { id: "6", title: "Lesson 6", x: 120, y: 560, status: "locked" },
  { id: "7", title: "Lesson 7", x: 220, y: 720, status: "locked" },
];

const TILE_SIZE = 100;
const MAP_HEIGHT = LESSONS[LESSONS.length - 1].y + TILE_SIZE + 50;

export default function LessonMapUIWithHeader() {
  return (
    <View style={{ flex: 1 }}>
      {/* Fake Header */}
      <View style={styles.fakeHeader}>
        <Ionicons name="menu" size={28} color={Colors.BLACK} />
        <Text style={styles.fakeHeaderTitle}>Lessons</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="help-circle"
            size={30}
            color={Colors.BLACK}
            style={{ marginRight: 12 }}
          />
          <Ionicons name="chatbox-ellipses" size={26} color={Colors.BLACK} paddingTop={2.5} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title and Subtitle */}
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Chapter 1</Text>
          <Text style={styles.subtitle}>The Letters of Baybayin</Text>
        </View>

        {/* Prologue Card */}
        <View style={styles.prologueCard}>
          <View style={styles.prologueTextWrapper}>
            <Text style={styles.prologueTitle}>Prologue</Text>
            <Text style={styles.prologueSubtext}>The Moon God's Hope Descends</Text>
          </View>
        </View>

        {/* Map */}
        <View style={styles.pathContainer}>
          <Svg height={MAP_HEIGHT} width="100%" style={StyleSheet.absoluteFill}>
            {/* Background dots */}
            {Array.from({ length: Math.ceil(MAP_HEIGHT / 60) }).flatMap((_, row) =>
              Array.from({ length: 6 }).map((_, col) => {
                const x = 40 + col * 60;
                const y = 40 + row * 60;
                return <Circle key={`bg-${row}-${col}`} cx={x} cy={y} r={4} fill="rgba(0,0,0,0.05)" />;
              })
            )}

            {/* Paths */}
            {LESSONS.map((_, index) => {
              if (index === LESSONS.length - 1) return null;
              const curr = LESSONS[index];
              const next = LESSONS[index + 1];

              const startX = curr.x + TILE_SIZE / 2;
              const startY = curr.y + TILE_SIZE / 2;
              const endX = next.x + TILE_SIZE / 2;
              const endY = next.y + TILE_SIZE / 2;

              const isCompletedConnection = curr.status === "completed" && next.status === "completed";

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

          {/* Lesson Nodes */}
          {LESSONS.map((lesson) => (
            <View key={lesson.id} style={[styles.nodeWrapper, { top: lesson.y, left: lesson.x }]}>
              <View
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
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fakeHeader: {
    height: 85,
    paddingTop: 25,
    backgroundColor: Colors.SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fakeHeaderTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.BLACK,
    paddingRight: 150,
  },
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  headerWrapper: {
    width: "85%",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  prologueCard: {
    width: "85%",
    height: 130,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
    justifyContent: "flex-end",
    padding: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  prologueTextWrapper: {
    alignItems: "flex-start",
  },
  prologueTitle: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
  prologueSubtext: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.WHITE,
  },
  pathContainer: {
    width: "100%",
    height: MAP_HEIGHT,
    marginBottom: 50,
  },
  nodeWrapper: {
    position: "absolute",
    alignItems: "center",
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  tileText: {
    fontSize: 12,
    fontFamily: "outfit",
    color: "white",
    textAlign: "center",
    marginTop: 4,
  },
});
