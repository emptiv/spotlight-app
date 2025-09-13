import Quiz from "@/components/Quiz";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";

const lessons: Record<
  string,
  { characters: any[]; modelName: string; lessonId: string }
> = {
  lesson1: {
    modelName: "lesson1",
    characters: [
      { symbol: "ᜀ", expected: "a", label: "A", modelName: "lesson1" },
      { symbol: "ᜁ", expected: "e_i", label: "E/I", modelName: "lesson1" },
      { symbol: "ᜂ", expected: "o_u", label: "O/U", modelName: "lesson1" },
    ],
    lessonId: "kd78w1b0ydkpt1wcppqwabwxc17qcm1d",
  },

  lesson2: {
    modelName: "lesson2",
    characters: [
      { symbol: "ᜉ", expected: "pa", label: "PA", modelName: "lessonx" },
      { symbol: "ᜃ", expected: "ka", label: "KA", modelName: "lesson2" },
      { symbol: "ᜈ", expected: "na", label: "NA", modelName: "lesson2" },
    ],
    lessonId: "kd7csv5619a75ebjzk8p94jnjn7qdd20",
  },

  lesson3: {
    modelName: "lesson3",
    characters: [
      { symbol: "ᜑ", expected: "ha", label: "HA", modelName: "lesson3" },
      { symbol: "ᜊ", expected: "ba", label: "BA", modelName: "lesson3" },
      { symbol: "ᜄ", expected: "ga", label: "GA", modelName: "lesson3" },
    ],
    lessonId: "kd7eyxaya8hpwm4gq111a3y1157qc6t5",
  },

  lesson4: {
    modelName: "lesson4",
    characters: [
      { symbol: "ᜐ", expected: "sa", label: "SA", modelName: "lesson4" },
      { symbol: "ᜇ", expected: "da_ra", label: "DA/RA", modelName: "lesson4" },
      { symbol: "ᜆ", expected: "ta", label: "TA", modelName: "lesson4" },
    ],
    lessonId: "kd708pwrbfnwp35n5h1w7aygs57qdvfq",
  },

  lesson5: {
    modelName: "lesson5",
    characters: [
      { symbol: "ᜅ", expected: "nga", label: "NGA", modelName: "lesson5" },
      { symbol: "ᜏ", expected: "wa", label: "WA", modelName: "lesson5" },
      { symbol: "ᜎ", expected: "la", label: "LA", modelName: "lesson5" },
    ],
    lessonId: "kd7a48rr4r4a7mweebyefesd657qcazw",
  },

  lesson6: {
    modelName: "lesson6",
    characters: [
      { symbol: "ᜋ", expected: "ma", label: "MA", modelName: "lesson6" },
      { symbol: "ᜌ", expected: "ya", label: "YA", modelName: "lesson6" },
    ],
    lessonId: "kd779f8vcr3v51eqmznajxxcp97qd14b",
  },

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
      characters={lessonData.characters}
      modelName={lessonData.modelName}
    />
  );
}
