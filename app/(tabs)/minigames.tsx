import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mini Games</Text>
      <Text style={styles.subtitle}>Challenge your skills</Text>

      <View style={{ marginBottom: 8 }}>
        <View style={[styles.card, styles.card3]}>
          <View style={styles.card3Group}>
            <Text style={styles.cardText}>Spelling Exercise</Text>
            <Text style={styles.cardSubtitle}>Test words in Baybayin</Text>
            <TouchableOpacity
              style={styles.card3Button}
              onPress={() => handlePress("/challenge/TypingIntro")}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("@/assets/images/spelling.png")}
            style={styles.card3Image}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={{ marginBottom: 8 }}>
        <View style={[styles.card, styles.card3]}>
          <View style={styles.card3Group}>
            <Text style={styles.cardText}>Offline Flashcards</Text>
            <Text style={styles.cardSubtitle}>Review characters anywhere</Text>
            <TouchableOpacity
              style={styles.card3Button}
              onPress={() => handlePress("/practice/cards")}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("@/assets/images/flashcard.png")}
            style={styles.card3ImageLower}
            resizeMode="contain"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginTop: -7,
    marginBottom: 33,
  },
  card: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
    height: 140,
  },
  card3: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 24,
    position: "relative",
  },
  card3Group: {
    marginTop: 45,
    marginLeft: 3,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  card3Button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 3,
    paddingHorizontal: 19,
    borderRadius: 17,
    marginTop: 6,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
  cardText: {
    fontSize: 19,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 1,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
    marginTop: -7,
    marginBottom: 5,
  },
  card3Image: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: 15,
    right: -25,
  },

  card3ImageLower: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: -10, // lower than the default 23
    right: -20, // slightly adjusted for better alignment
  },
});
