import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Welcome to the App!</Text>

      <Image
        source={{ uri: "https://placekitten.com/400/200" }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.subtitle}>Start Learning:</Text>

      <View style={styles.lessonList}>
        <TouchableOpacity
          style={styles.lessonButton}
          onPress={() => router.push("/lessons/lesson-1")}
        >
          <Text style={styles.lessonText}>📘 Lesson 1: Introduction</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lessonButton}
          onPress={() => router.push("/lessons/lesson-2")}
        >
          <Text style={styles.lessonText}>📗 Lesson 2: Basics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lessonButton}
          onPress={() => router.push("/lessons/lesson-3")}
        >
          <Text style={styles.lessonText}>📙 Lesson 3: Practice</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  welcome: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "outfit-semibold",
    color: Colors.BLACK,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  lessonList: {
    width: "100%",
    gap: 16,
  },
  lessonButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  lessonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
