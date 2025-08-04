import ChallengeIntro from "@/components/ChallengeIntro";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

export default function FlashcardIntroScreen() {
  const router = useRouter();
  const { user } = useUser();

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
          Loading progress...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ChallengeIntro
        title="Spelling Exercises"
        description="Learn at your own pace before taking the challenge."
        bestScore={bestPerformance.bestScore}
        bestStars={bestPerformance.bestStars}
        onPrimaryPress={() => router.push("/practice/type")}
        onSecondaryPress={() => router.push("/quiz/SpellingQuizScreen")}
        primaryLabel="Review"
        secondaryLabel="Start"
      />
    </SafeAreaView>
  );
}
