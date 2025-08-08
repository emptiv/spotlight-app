import ChallengeIntro from "@/components/ChallengeIntro";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
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

  const bestPerformance = useQuery(api.typing.getBestTypingPerformance, {
    userId: convexUserId ?? "",
  });

  if (!user || !convexUserId || !bestPerformance) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontFamily: "outfit" }}>
          {t.loading[lang]}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ChallengeIntro
        title={t.title[lang]}
        description={t.description[lang]}
        bestScore={bestPerformance.bestScore}
        bestStars={bestPerformance.bestStars}
        onPrimaryPress={() => router.push("/practice/type")}
        onSecondaryPress={() => router.push("/quiz/SpellingQuizScreen")}
        primaryLabel={t.primaryLabel[lang]}
        secondaryLabel={t.secondaryLabel[lang]}
      />
    </SafeAreaView>
  );
}
