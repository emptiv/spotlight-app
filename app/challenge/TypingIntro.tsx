import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../components/LanguageContext";

export default function FlashcardIntroScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { lang } = useLanguage();

  const t = {
    title: {
      en: "Spelling Exercises",
      fil: "Mga Ehersisyo sa Baybay",
    },
    description: {
      en: "Learn at your own pace before taking the challenge.",
      fil: "Matutong ayon sa iyong bilis bago simulan ang hamon.",
    },
    loading: {
      en: "Loading progress...",
      fil: "Loading progress...",
    },
    primaryLabel: {
      en: "Review",
      fil: "Review",
    },
    secondaryLabel: {
      en: "Start",
      fil: "Start",
    },
  };

  const convexUserId = useQuery(api.users.getConvexUserIdByClerkId, {
    clerkId: user?.id ?? "",
  });

  const bestPerformances = useQuery(api.typing.getBestPerformancesByType, {
    userId: convexUserId ?? "",
  });

  if (!user || !convexUserId || !bestPerformances) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{t.loading[lang]}</Text>
      </View>
    );
  }

  function getPerformance(difficulty: string) {
    if (!bestPerformances) {
      return { bestScore: 0 };
    }

    const key = Object.keys(bestPerformances).find((k) =>
      k.endsWith(difficulty)
    );
    if (key) {
      return bestPerformances[key];
    }
    return { bestScore: 0 };
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
          onPress={async () => {
            await playSound('click');
            router.back();
          }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>{t.title[lang]}</Text>

        <View style={styles.topRow}>
          {["easy", "medium"].map((diff) => {
            const { bestScore } = getPerformance(diff);
            return (
              <View key={diff} style={styles.card}>
                <Text style={styles.difficultyText}>{diff.toUpperCase()}</Text>
                <Text style={styles.scoreLabel}>Best Score:</Text>
                <Text style={styles.scoreValue}>{bestScore}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.bottomRow}>
          {(() => {
            const diff = "hard";
            const { bestScore } = getPerformance(diff);
            return (
              <View key={diff} style={[styles.card, styles.hardCard]}>
                <Text style={styles.difficultyText}>{diff.toUpperCase()}</Text>
                <Text style={styles.scoreLabel}>Best Score:</Text>
                <Text style={styles.scoreValue}>{bestScore}</Text>
              </View>
            );
          })()}
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{t.description[lang]}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await playSound("click");
              router.push("/practice/type");
            }}
          >
            <Text style={styles.buttonText}>{t.primaryLabel[lang]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await playSound("click");
              router.push("/quiz/SpellingQuizScreen");
            }}
          >
            <Text style={styles.buttonText}>{t.secondaryLabel[lang]}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 65,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontFamily: "outfit",
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bottomRow: {
    alignItems: "center",
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  hardCard: {
    minWidth: 160,
    marginHorizontal: 0,
  },
  difficultyText: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#444",
    fontFamily: "outfit",
    textAlign: "center",
    marginTop: 8,
  },
  scoreValue: {
    fontSize: 28,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  descriptionBox: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "outfit",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
