import ChallengeIntro from "@/components/ChallengeIntro";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";

export default function FlashcardIntroScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ChallengeIntro
        title="Spelling Exercises"
        description="Learn at your own pace before taking the challenge."
        bestScore={85}
        bestStars={2}
        onPrimaryPress={() => router.push("/practice/type")}
        onSecondaryPress={() => router.push("/challenge/SpellingQuizScreen")}
        primaryLabel="Review"
        secondaryLabel="Start"
      />
    </SafeAreaView>
  );
}
