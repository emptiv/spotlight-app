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

const tourEndDialogue = [
  { text: "That’s the end of our quick tour!", image: require("@/assets/ming/default.png") },
  { text: "Now you know your way around the app.", image: require("@/assets/ming/default.png") },
  { text: "Soon, you’ll be writing Baybayin like a pro!", image: require("@/assets/ming/default.png") },
  { text: "If you need extra help, check out the Help section in the navigation bar anytime.", image: require("@/assets/ming/default.png") },
  { text: "It has instructions for anything we didn’t cover in the tour.", image: require("@/assets/ming/default.png") },
  { text: "Feel free to visit it whenever you want!", image: require("@/assets/ming/default.png") },
  { text: "Alright, that’s all from me! Goodbye for now!", image: require("@/assets/ming/default.png") },
];


// 🔹 Tour registry
const scripts: Record<string, any[]> = {
  intro: tourEndDialogue,
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
    const chosen = module && scripts[module] ? scripts[module] : tourEndDialogue;
    return chosen;
  }, [module]);

  const handleNext = () => {
    if (currentLine < tourScript.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      // ✅ End → route back to home screen
      router.replace("../help");
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
