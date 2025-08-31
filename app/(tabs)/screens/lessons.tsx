import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useConvex, useQuery } from "convex/react";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from 'react-native-confetti-cannon';
import Svg, { Circle, Path } from "react-native-svg";
import { useLanguage } from "../../../components/LanguageContext";

const LESSONS = [
  { id: "jx72aewjef2n2jzw5ajht6b32s7jb6bm", title: "Lesson 1", path: "/lessons/lesson1", x: 100, y: 4 },
  { id: "jx73gf6kgan5zd49zfjza2hyss7jamra", title: "Lesson 2", path: "/lessons/lesson2", x: 220, y: 140 },
  { id: "jx7fgkbfxajnghpcgf9ebjhjdd7jb9s1", title: "Lesson 3", path: "/lessons/lesson3", x: 60, y: 240 },
  { id: "jx75w094cp3g52bw137thd7fy57jbrn3", title: "Lesson 4", path: "/lessons/lesson4", x: 60, y: 400 },
  { id: "jx7aznjdjmag8g7v2v7w7mavtn7jbf9p", title: "Lesson 5", path: "/lessons/lesson5", x: 220, y: 400 },
  { id: "jx755h0x70cmbc38y6h4wjzss97jaae7", title: "Lesson 6", path: "/lessons/lesson6", x: 120, y: 560 },
  { id: "jx71t9nq18esz01frqwe6af9xn7md24g", title: "Lesson 7", path: "/lessons/lesson7", x: 220, y: 720 },
];

const TILE_SIZE = 100;
const MAP_HEIGHT = LESSONS[LESSONS.length - 1].y + TILE_SIZE + 50;

export default function LessonMap() {
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();
  const convex = useConvex();
  const { lang } = useLanguage();
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<any>(null);

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
      setCompletedLessons(Array.isArray(result) ? result : []);
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

  const t = {
    en: {
      chapter: "Chapter 1",
      subtitle: "The Letters of Baybayin",
      prologue: "Onboarding Tour",
      prologueSubtext: " The Kneow-ledgeable Cat",
      loading: "Loading map...",
      achievementTitle: "🎉 Supernova Badge Earned!",
      achievementDesc: "You completed all lessons. Well done!",
    },
    fil: {
      chapter: "Kabanata 1",
      subtitle: "Mga Titik ng Baybayin",
      prologue: "Gabay sa Pagsisimula",
      prologueSubtext: "Ang Meow-alam na Pusa",
      loading: "Ikinakarga ang mapa...",
      achievementTitle: "🎉 Supernova Badge Nakuha!",
      achievementDesc: "Natapos mo na ang lahat ng aralin. Magaling!",
    },
  }[lang];

  if (!convexUserId || loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" />
        <Text>{t.loading}</Text>
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

return (
  <ScrollView contentContainerStyle={styles.container}>
    {/* Title and Subtitle */}
    <View style={styles.headerWrapper}>
      <Text style={styles.title}>{t.chapter}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>
    </View>

    {/* Prologue Card */}
    <TouchableOpacity
      style={styles.prologueCard}
      activeOpacity={0.8}
      onPress={async () => {
        await playSound('click');
        router.push('../../ming');
      }}
    >
      <View style={styles.prologueTextWrapper}>
        <Text style={styles.prologueTitle}>{t.prologue}</Text>
        <Text style={styles.prologueSubtext}>{t.prologueSubtext}</Text>
      </View>
    </TouchableOpacity>

    {/* Map */}
    <View style={styles.pathContainer}>
      <Svg height={MAP_HEIGHT} width="100%" style={StyleSheet.absoluteFill}>
        {/* Background dots */}
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

        {/* Paths */}
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

      {/* Lesson Nodes */}
      {lessonsWithStatus.map((lesson) => (
        <View
          key={lesson.id}
          style={[styles.nodeWrapper, { top: lesson.y, left: lesson.x }]}
        >
          <TouchableOpacity
            activeOpacity={lesson.status !== "locked" ? 0.7 : 1}
            onPress={async () => {
              if (lesson.status !== "locked") {
                await playSound('click');
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

    {/* Achievement Card at the end */}
    {completedLessons.length >= LESSONS.length && (
      <TouchableOpacity
        style={styles.achievementWrapper}
        activeOpacity={0.8}
        onPress={() => {
          setShowConfetti(true); // trigger confetti immediately

          setTimeout(() => {
            playSound('confetti'); // play sound after 300ms
          }, 300);
        }}
      >
        <Image
          source={require("../../../assets/badges/supernova.png")}
          style={styles.achievementImage}
          resizeMode="contain"
        />
        <Text style={styles.achievementTitle}>{t.achievementTitle}</Text>
        <Text style={styles.achievementDescription}>{t.achievementDesc}</Text>

        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: 0, y: 0 }}
            fadeOut={true}
            onAnimationEnd={() => setShowConfetti(false)}
          />
        )}
      </TouchableOpacity>
    )}
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  headerWrapper: {
    width: '85%',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
  },
  prologueCard: {
    width: '85%',
    height: 130,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 20,
    justifyContent: 'flex-end',
    padding: 16,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  prologueTextWrapper: {
    alignItems: 'flex-start',
  },
  prologueTitle: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
  },
  prologueSubtext: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: Colors.WHITE,
  },
  pathContainer: {
    width: '100%',
    height: MAP_HEIGHT,
    marginBottom: 50,
  },
  nodeWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tileText: {
    fontSize: 12,
    fontFamily: 'outfit',
    color: 'white',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementCard: {
    width: '85%',
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 16,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
achievementWrapper: {
  width: '85%',
  backgroundColor: Colors.PRIMARY, // dark background for contrast
  borderRadius: 20,
  paddingVertical: 24,
  paddingHorizontal: 16,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 5,
  marginTop: -50,
},
achievementImage: {
  width: 100,
  height: 100,
  borderRadius: 100,
  marginBottom: 16,
},
achievementTitle: {
  fontSize: 22,
  fontFamily: 'outfit-bold',
  color: '#FFD700', // gold color to match badge theme
  textAlign: 'center',
  marginBottom: 8,
},
achievementDescription: {
  fontSize: 14,
  fontFamily: 'outfit',
  color: '#FFFFFF',
  textAlign: 'center',
},
});
