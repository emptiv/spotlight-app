import Quiz from "@/components/Quiz";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";

const lessons: Record<
  string,
  { characters: any[]; modelName: string; lessonId: string }
> = {
  lesson1: {
    characters: [
      { symbol: "ᜀ", expected: "a", label: "A" },
      { symbol: "ᜁ", expected: "e_i", label: "E/I" },
      { symbol: "ᜂ", expected: "o_u", label: "O/U" },
    ],
    lessonId: "jx72aewjef2n2jzw5ajht6b32s7jb6bm",
    modelName: "lesson1",
  },
  // Add other lessons here
};

export default function QuizRouter() {
  const { lessonRoute } = useLocalSearchParams();
  const router = useRouter();

  const lessonData = lessons[lessonRoute as string];

  if (!lessonData) {
    return <Text>Quiz not found.</Text>;
  }

  return (
    <Quiz
      lessonId={lessonData.lessonId}
      modelName={lessonData.modelName}
      characters={lessonData.characters}
    />
  );
}
