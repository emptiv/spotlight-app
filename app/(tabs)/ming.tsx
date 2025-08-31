import Colors from "@/constants/Colors"; // adjust path
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🔹 Dialogue scripts
const introDialogue = [
  { text: "Meow! Hello!", image: require("@/assets/ming/default.png") },
  { text: "I am Mingming!", image: require("@/assets/ming/default.png") },
  { text: "An orange cat sent to relay a message.", image: require("@/assets/ming/default.png") },
  { text: "Simply put, I’m a cat messenger.", image: require("@/assets/ming/default.png") },
  { text: "And this cat’s message is…", image: require("@/assets/ming/default.png") },
  { text: "A lost art!", image: require("@/assets/ming/default.png") },
  { text: "I am here to teach you Baybayin!", image: require("@/assets/ming/default.png") },
  { text: "Are you familiar with the word “Baybayin”?", image: require("@/assets/ming/default.png") },
  { text: "If not, that’s okay. I can give you a simple description!", image: require("@/assets/ming/default.png") },
  { text: "Baybayin comes from the root word “baybay,” which means to spell.", image: require("@/assets/ming/default.png") },
  { text: "It was used back then as a form of communication.", image: require("@/assets/ming/default.png") },
  { text: "Right, the natives could read and write!", image: require("@/assets/ming/default.png") },
  { text: "They wrote poetry, incantations, and letters using Baybayin.", image: require("@/assets/ming/default.png") },
  { text: "They had their own way of writing before the land was occupied by the Spanish.", image: require("@/assets/ming/default.png") },
  { text: "As time passed, Filipinos gradually adopted the Latin alphabet we use today.", image: require("@/assets/ming/default.png") },
  { text: "Isn’t it fascinating that Filipinos had their own way of writing?", image: require("@/assets/ming/default.png") },
  { text: "Now, are you ready to learn Baybayin?", image: require("@/assets/ming/default.png") },
  { text: "Don’t worry—I’ll give you a quick tour of the app first!", image: require("@/assets/ming/default.png") },
  { text: "We’ll take a look at the main screens and see what’s inside.", image: require("@/assets/ming/default.png") },
];


// 🔹 Tour registry
const scripts: Record<string, any[]> = {
  intro: introDialogue,
};

export default function MingTourScreen() {
  const router = useRouter();
  const { module } = useLocalSearchParams<{ module?: string }>();
  const [currentLine, setCurrentLine] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setCurrentLine(0);
    }, [])
  );

  // Pick script based on module, fallback to intro
  const tourScript = useMemo(() => {
    const chosen = module && scripts[module] ? scripts[module] : introDialogue;
    return chosen;
  }, [module]);

  const handleNext = () => {
    if (currentLine < tourScript.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      // ✅ End → route back to home screen
      router.replace("/tour/TourHomeO");
      setCurrentLine(0)
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Ming image */}
        <Image
          source={tourScript[currentLine].image}
          style={styles.mingImage}
          resizeMode="contain"
        />

        {/* Dialogue bubble */}
        <View style={styles.dialogueWrapper}>
          <Text style={styles.nameLabel}>Ming</Text>
          <View style={styles.dialogueContainer}>
            <Text style={styles.dialogueText}>
              {tourScript[currentLine].text}
            </Text>
          </View>
        </View>

        {/* Next button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Ionicons
            name="arrow-forward-circle"
            size={52}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  mingImage: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  dialogueWrapper: {
    width: width - 48,
    marginBottom: 16,
    position: "relative",
  },
  nameLabel: {
    position: "absolute",
    top: -28,
    left: 10,
    backgroundColor: Colors.WHITE,
    fontSize: 18,
    color: Colors.PRIMARY,
    fontFamily: "outfit",
  },
  dialogueContainer: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  dialogueText: {
    fontSize: 18,
    color: Colors.PRIMARY,
    textAlign: "center",
    fontFamily: "outfit",
  },
  nextButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
});
