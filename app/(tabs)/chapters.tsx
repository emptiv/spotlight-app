import Colors from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useLanguage } from "../../components/LanguageContext";

const PROGRESS_SIZE = 75;
const STROKE_WIDTH = 5;
const RADIUS = (PROGRESS_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ChaptersScreen() {
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const { lang } = useLanguage();

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
      {lang === 'en' && <Text style={styles.title}>Lessons</Text>}
      {lang === 'fil' && <Text style={styles.title}>Mga Aralin</Text>}

      {lang === 'en' && <Text style={styles.subtitle}>Begin to remember...</Text>}
      {lang === 'fil' && <Text style={styles.subtitle}>Simulan ang pag-alala...</Text>}

      <TouchableOpacity
        style={[styles.card, styles.chapterCard]}
        activeOpacity={0.9}
        onPress={() => router.push("/screens/lessons")}
      >
        {/* LEFT SIDE — Text and Fake Button */}
        <View style={styles.textColumn}>
          {lang === 'en' && (
            <Text
              style={styles.chapterName}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Chapter 1: The Letters of Baybayin
            </Text>
          )}
          {lang === 'fil' && (
            <Text
              style={styles.chapterName}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Kabanata 1: Mga Titik ng Baybayin
            </Text>
          )}

          {/* Fake Button — for look only */}
          <View style={styles.chapterButton}>
            <Text style={styles.buttonText}>
              {lang === 'en' ? 'Start' : 'Start'}
            </Text>
          </View>
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
      </TouchableOpacity>
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
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  chapterName: {
    fontSize: 17,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    maxWidth: 180,
    textAlign: 'left',
  },
  chapterButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 4,
    paddingHorizontal: 50,
    marginTop: 12,
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
    marginTop: -28,
  },
  progressLabel: {
    position: 'absolute',
    fontSize: 13,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
});
