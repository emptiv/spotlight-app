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

  // ✅ Game Over overlay animation
  const [showOverlay, setShowOverlay] = useState(gameOver === "true");
  const fadeAnim = useRef(new Animated.Value(1)).current;

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

  // ✅ Badge overlay animation
  const [showBadgeOverlay, setShowBadgeOverlay] = useState(parsedBadges.length > 0);
  const badgeFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (parsedBadges.length > 0) {
      setShowBadgeOverlay(true);
      playSound("success");
      const timer = setTimeout(() => {
        fadeOutBadgeOverlay();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fadeOutBadgeOverlay = () => {
    Animated.timing(badgeFadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowBadgeOverlay(false);
    });
  };

  const numericStars = Math.max(0, Math.min(3, Number(stars)));
  const totalPoints = Number(score);

  const parsedAnswers: AnswerSummary[] = answers
    ? JSON.parse(decodeURIComponent(answers))
    : [];

  // ✅ Message + image mapping
  let message = "";
  let messageImage = require("@/assets/ming/default.png");

  if (numericStars === 3) {
    message = "Excellent, kaibigan!\nPerfect score!";
    messageImage = require("@/assets/ming/heart.png");
  } else if (numericStars === 2) {
    message = "You did well! You’re almost there!\nPractice makes perfect.";
    messageImage = require("@/assets/ming/default.png");
  } else {
    message = "It’s okay, you can try again.\nI’m sure this time you will succeed.";
    messageImage = require("@/assets/ming/fire.png");
  }

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

        {/* ✅ Message with image outside */}
        <View style={styles.messageRow}>
          <Image 
            source={messageImage} 
            style={styles.messageImage} 
            resizeMode="contain"
          />
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>

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
                      [{ans.type}] {ans.symbol} ({ans.label}) → {ans.result.toUpperCase()} +{ans.pointsEarned}
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
              style={[styles.button]}
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

      {/* ✅ Game Over overlay */}
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

      {/* ✅ New Badges overlay */}
      {showBadgeOverlay && (
        <Animated.View style={[styles.overlay, { opacity: badgeFadeAnim }]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlayTouchable}
            onPress={fadeOutBadgeOverlay}
          >
            <Ionicons name="ribbon" size={64} color={Colors.PRIMARY} />
            <Text style={styles.gameOverText}>
              New Badge{parsedBadges.length > 1 ? "s" : ""} Earned!
            </Text>

            {parsedBadges.map((badge, idx) => (
              <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                {badgeImages[badge.toLowerCase()] ? (
                  <Image
                    source={badgeImages[badge.toLowerCase()]}
                    style={{ width: 40, height: 40, marginRight: 8, borderRadius: 100 }}
                  />
                ) : (
                  <Ionicons name="ribbon" size={28} color={Colors.PRIMARY} style={{ marginRight: 8 }} />
                )}
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}

            <Text style={styles.gameOverSubtext}>Check Achievements for details</Text>
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
    color: Colors.PRIMARY,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  score: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  messageBubble: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "65%",
    alignItems: "center",
  },
  messageImage: {
    width: 100,
    height: 100,
    marginRight: -10,
  },
  messageText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
    flexWrap: "wrap",
    justifyContent: "center",
    textAlign: "center",
  },
  badgeText: {
    fontFamily: "outfit",
    fontSize: 16,
    marginLeft: 8,
    color: Colors.PRIMARY,
  },
  toggleButton: {
    marginTop: 20,
    marginBottom: 16,
    width: '65%',
    alignSelf: 'center',
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  toggleButtonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontFamily: "outfit-bold",
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
    marginTop: 20,
    width: '65%',
    alignSelf: 'center',
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontFamily: "outfit-bold",
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
});
