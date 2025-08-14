import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CharacterTile = {
  symbol: string;
  label: string;
};

type LessonOverviewProps = {
  lessonId: string;
  characters: CharacterTile[];
  bestScore: number;
  bestStars: number; // 0 to 3
  onStudyPress: () => void;
  onQuizPress: () => void;
};

export default function LessonOverviewScreen({
  lessonId,
  characters,
  bestScore,
  bestStars,
  onStudyPress,
  onQuizPress,
}: LessonOverviewProps) {
  const router = useRouter();

  const renderCharacter = ({ item }: { item: CharacterTile }) => (
    <View style={styles.charTile}>
      <Text style={styles.charSymbol}>{item.symbol}</Text>
      <Text style={styles.charLabel}>{item.label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
      onPress={async () => {
        await playSound('click');
        router.back();
      }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Lesson {lessonId.toUpperCase()}</Text>

        <View style={styles.statsBox}>
          <View style={styles.row}>
            {[...Array(3)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < bestStars ? "star" : "star-outline"}
                size={55}
                color={Colors.PRIMARY}
              />
            ))}
          </View>
          <Text style={styles.scoreText}>Best Score: {bestScore}</Text>
        </View>

        <FlatList
          data={characters}
          keyExtractor={(item, idx) => `${item.symbol}-${idx}`}
          renderItem={renderCharacter}
          numColumns={2}
          columnWrapperStyle={styles.charRow}
          contentContainerStyle={styles.charList}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={async () => {
              await playSound('click');
              onStudyPress();
            }}
          >
            <Text style={styles.buttonText}>Study</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={async () => {
              await playSound('click');
              onQuizPress();
            }}
          >
            <Text style={styles.buttonText}>Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 16,
  },
  statsBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  scoreText: {
    marginTop: 15,
    fontSize: 20,
    color: "#444",
    fontFamily: "outfit-bold",
  },
  charList: {
    paddingVertical: 16,
  },
  charRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  charTile: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 1,
  },
  charSymbol: {
    fontSize: 32,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  charLabel: {
    fontSize: 14,
    color: "#555",
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
