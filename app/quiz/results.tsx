import { playSound } from '@/constants/playClickSound';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Colors from "../../constants/Colors";

type AnswerSummary = {
  symbol: string;
  label: string;
  type: string;
  expected: string;
  result: "correct" | "wrong";
  pointsEarned: number;
};

export default function QuizResults() {
  const { stars, score, lessonRoute, answers, gameOver, badges } =
    useLocalSearchParams<{
      stars: string;
      score: string;
      lessonRoute?: string;
      answers?: string;
      gameOver?: string;
      badges?: string;
    }>();

  const router = useRouter();
  const [showAnswers, setShowAnswers] = useState(false);

  const parsedBadges: string[] = badges
    ? JSON.parse(decodeURIComponent(badges))
    : [];

  const badgeImages: Record<string, any> = {
  challenger: require('@/assets/badges/challenger.png'),
  perfectionist: require('@/assets/badges/perfectionist.png'),
  'su-su-supernova': require('@/assets/badges/supernova.png'),
};

  // For overlay animation
  const [showOverlay, setShowOverlay] = useState(gameOver === "true");
  const fadeAnim = useRef(new Animated.Value(1)).current;


  // ✅ Play sound once when screen loads
  useEffect(() => {
    if (gameOver === "true") {
      setShowOverlay(true);
      playSound("gameover");
    } else {
      playSound("success");
    }
  }, []);

  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => {
        fadeOutOverlay();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  const fadeOutOverlay = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowOverlay(false);
    });
  };

  const numericStars = Math.max(0, Math.min(3, Number(stars)));
  const totalPoints = Number(score);

  const parsedAnswers: AnswerSummary[] = answers
    ? JSON.parse(decodeURIComponent(answers))
    : [];

  const message =
    numericStars === 3
      ? "Excellent! Perfect score!"
      : numericStars === 2
      ? "Great work! You're almost there."
      : "Keep practicing! Try again for a better score.";

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quiz Results</Text>

        <View style={styles.starsContainer}>
          {[...Array(3)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < numericStars ? "star" : "star-outline"}
              size={32}
              color={Colors.PRIMARY}
            />
          ))}
        </View>

        <Text style={styles.score}>You earned {totalPoints} points</Text>
        <Text style={styles.message}>{message}</Text>

{/* ✅ Badge display */}
{parsedBadges.length > 0 && (
  <View style={styles.badgesContainer}>
    <Text style={styles.badgesTitle}>New Badges Earned</Text>
    {parsedBadges.map((badge, idx) => (
      <TouchableOpacity 
        key={idx} 
        style={styles.badgeCard}
        onPress={async () => {
          await playSound("click"); // optional click sound
          router.push("/dashb/achievements"); // navigate to achievements screen
        }}
        >
        {badgeImages[badge.toLowerCase()] ? (
          <Image
            source={badgeImages[badge.toLowerCase()]}
            style={{ width: 32, height: 32, marginRight: 8, borderRadius: 100 }}
          />
        ) : (
          <Ionicons name="ribbon" size={22} color={Colors.PRIMARY} />
        )}
        <Text style={styles.badgeText}>{badge}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}


        <TouchableOpacity
          style={styles.toggleButton}
          onPress={async () => {
            await playSound("click");
            setShowAnswers((prev) => !prev);
          }}
        >
          <Text style={styles.toggleButtonText}>
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </Text>
        </TouchableOpacity>

        {showAnswers && (
          <View style={styles.answersBox}>
            {parsedAnswers.length === 0 ? (
              <Text style={styles.answerText}>No answers available.</Text>
            ) : (
              parsedAnswers.map((ans, i) => {
                const isCorrect = ans.result === "correct";
                return (
                  <View
                    key={i}
                    style={[
                      styles.answerCard,
                      isCorrect ? styles.correctCard : styles.incorrectCard,
                    ]}
                  >
                    <Ionicons
                      name={isCorrect ? "checkmark-circle" : "close-circle"}
                      size={22}
                      color={isCorrect ? "green" : "red"}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.answerText}>
                      [{ans.type}] {ans.symbol} ({ans.label}) →{" "}
                      {ans.result.toUpperCase()} +{ans.pointsEarned}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await playSound("click");
              router.replace("/");
              }}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>

          {lessonRoute && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.GRAY }]}
              onPress={async () => {
                await playSound("click");
                router.replace(`/quiz/${lessonRoute}` as any);
              }}
            >
              <Text style={styles.buttonText}>Retake Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {showOverlay && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlayTouchable}
            onPress={fadeOutOverlay}
          >
            <Ionicons name="close-circle" size={64} color={Colors.PRIMARY} />
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.gameOverSubtext}>You ran out of hearts!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  score: {
    fontSize: 20,
    fontFamily: "outfit",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginBottom: 24,
    textAlign: "center",
  },
  badgesContainer: {
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  badgesTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  badgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f8ff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: "100%",
  },
  badgeText: {
    fontFamily: "outfit",
    fontSize: 16,
    marginLeft: 8,
    color: Colors.PRIMARY,
  },
  toggleButton: {
    marginBottom: 16,
    backgroundColor: Colors.GRAY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.WHITE,
  },
  answersBox: {
    width: "100%",
    marginBottom: 24,
  },
  answerCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    position: "relative",
  },
  correctCard: {
    backgroundColor: "#e6ffec",
    borderColor: "#b2f2bb",
    borderWidth: 1,
  },
  incorrectCard: {
    backgroundColor: "#ffe6e6",
    borderColor: "#f5c2c7",
    borderWidth: 1,
  },
  cardIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  answerText: {
    fontFamily: "outfit",
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayTouchable: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 36,
    paddingHorizontal: 44,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 280,
  },
  gameOverText: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    color: Colors.PRIMARY,
    marginTop: 12,
    marginBottom: 6,
  },
  gameOverSubtext: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.GRAY,
    marginBottom: 20,
    textAlign: "center",
  },
badgesRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 12,
},
badgeCircle: {
  width: 80,
  height: 80,
  borderRadius: 40, // makes it circular
  backgroundColor: "#f1f8ff",
  justifyContent: "center",
  alignItems: "center",
  padding: 8,
},
badgeTextCircle: {
  fontFamily: "outfit",
  fontSize: 12,
  color: Colors.PRIMARY,
  marginTop: 4,
  textAlign: "center",
},

});
