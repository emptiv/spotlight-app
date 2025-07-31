import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SpellingAndCards() {
  const router = useRouter();

  const handlePress = async (route: string) => {
    await playSound("click");
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity
          style={styles.tile}
          onPress={() => handlePress("/challenge/TypingIntro")}
        >
          <Ionicons name="create" size={40} color={Colors.PRIMARY} />
          <Text style={styles.title}>Spelling Exercises</Text>
          <Text style={styles.subtitle}>Test words in Baybayin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => handlePress("/flashcards")}
        >
          <Ionicons name="copy" size={40} color={Colors.PRIMARY} />
          <Text style={styles.title}>Offline Flashcards</Text>
          <Text style={styles.subtitle}>Review characters anywhere</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  tile: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    borderColor: Colors.PRIMARY,
    borderWidth: 0,
    paddingVertical: 50,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  icon: {
    fontSize: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginTop: 4,
  },
});
