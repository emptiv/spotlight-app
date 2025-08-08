// app/Chapters.tsx or app/(tabs)/Chapters.tsx
import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const PROGRESS_SIZE = 75;
const STROKE_WIDTH = 5;
const RADIUS = (PROGRESS_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ...imports
export default function ChaptersScreen() {
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: clerkUserId ?? "",
  });

  const completedLessons = useQuery(api.user_lesson_progress.getCompletedLessons, {
    userId: convexUserId ?? "",
  });

  const LESSONS = 7;
  const completedCount = Array.isArray(completedLessons) ? completedLessons.length : 0;
  const progress = LESSONS ? completedCount / LESSONS : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lessons</Text>
      <Text style={styles.subtitle}>Begin to remember...</Text>

      <View style={[styles.card, styles.chapterCard]}>
        {/* LEFT SIDE — Text and Button */}
        <View style={styles.textColumn}>
          <Text style={styles.chapterName}>Chapter 1: The Letters of Baybayin</Text>
          <TouchableOpacity
            style={styles.chapterButton}
            onPress={() => router.push("/screens/lessons")}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </View>

        {/* RIGHT SIDE — Image and Progress */}
        <View style={styles.visualColumn}>
          <Image
            source={require("../../assets/images/feather.png")}
            style={styles.chapterImage}
            resizeMode="contain"
          />
          <View style={styles.progressContainer}>
            <Svg width={PROGRESS_SIZE} height={PROGRESS_SIZE}>
              <Circle
                stroke={Colors.WHITE}
                fill={Colors.WHITE}
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
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 32,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: -3,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 35,
  },
  card: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: 16,
    position: 'relative',
  },
  chapterCard: {
    paddingBottom: 24,
  },
  textColumn: {
    flex: 1,
    paddingLeft: 6,
    paddingTop: 2,
    paddingBottom: -200,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', // ensure left alignment
  },
  chapterName: {
    fontSize: 17,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
  chapterButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 4,
    paddingHorizontal: 50,
    marginTop: 30,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
  },
  visualColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  chapterImage: {
    width: 70,
    height: 160,
    marginRight: -25,
    marginTop: -100,
    marginBottom: 2,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: -5,
    marginTop: -28
  },
  progressLabel: {
    position: 'absolute',
    fontSize: 13,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
});
