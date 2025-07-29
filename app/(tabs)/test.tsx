import BaybayinKeyboard from "@/components/BaybayinKeyboard";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function BaybayinKeyboardTest() {
  const [typed, setTyped] = useState("");

  const handleKeyPress = (char: string) => {
    if (char === "DEL") {
      setTyped((prev) => prev.slice(0, -1));
    } else {
      setTyped((prev) => prev + char);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Baybayin Keyboard Test</Text>
      <View style={styles.inputBox}>
        <Text style={styles.inputText}>{typed || "Tap to start typing..."}</Text>
      </View>
      <BaybayinKeyboard onKeyPress={handleKeyPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "white" },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: "center",
    marginBottom: 16,
  },
  inputText: { fontSize: 28 },
});
