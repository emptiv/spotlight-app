import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Lesson2() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lesson 1: Introduction to Cats</Text>

      <Text style={styles.paragraph}>
        Welcome to Lesson 2. In this lesson, you’ll learn about cats — their
        behavior, their quirks, and why they love boxes so much.
      </Text>

      {[...Array(8)].map((_, i) => (
        <Text style={styles.paragraph} key={i}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          fermentum, ligula at iaculis tempor, nisl ex malesuada neque, a
          placerat ligula augue in nisi. Praesent volutpat, lorem eu suscipit
          rhoncus, est arcu fermentum enim, in viverra erat justo in orci.
        </Text>
      ))}

      <View style={styles.buttonContainer}>
        <Link href="/quiz/q-lesson-2" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Quiz</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: "outfit-bold",
    marginBottom: 16,
    color: Colors.BLACK,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "outfit",
    lineHeight: 24,
    marginBottom: 12,
    color: Colors.GRAY,
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
