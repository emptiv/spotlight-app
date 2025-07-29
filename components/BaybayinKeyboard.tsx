import Colors from "@/constants/Colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const KEY_ROWS = [
  ["ᜃ", "ᜄ", "ᜅ", "ᜒ", "ᜆ", "ᜇ", "ᜈ"],
  ["ᜉ", "ᜊ", "ᜋ", "ᜓ", "ᜌ", "ᜎ", "ᜏ"],
  ["ᜀ", "ᜁ", "ᜂ", "᜔", "ᜐ", "ᜑ", "DEL"],
  ["᜵", "SPACE", "᜶"],
];

const KUDLITS = ["ᜒ", "ᜓ", "᜔"];
const VOWELS = ["ᜀ", "ᜁ", "ᜂ"];
const isKudlit = (c: string) => KUDLITS.includes(c);
const isConsonant = (c: string) =>
  !KUDLITS.includes(c) && !["SPACE", "DEL", ...VOWELS, "᜵", "᜶"].includes(c);

export default function BaybayinKeyboard({
  onKeyPress,
}: {
  onKeyPress: (char: string) => void;
}) {
  const [lastConsonant, setLastConsonant] = useState<string | null>(null);
  const [inputBuffer, setInputBuffer] = useState<string>("");
  const [lastIsVowel, setLastIsVowel] = useState<boolean>(false);

  const handleKeyPress = (char: string) => {
    if (char === "SPACE") {
      setLastConsonant(null);
      setLastIsVowel(false);
      setInputBuffer((prev) => prev + " ");
      onKeyPress(" ");
    } else if (char === "DEL") {
      setInputBuffer((prev) => {
        const updated = prev.slice(0, -1);
        const last = updated.slice(-1);
        if (isConsonant(last)) {
          setLastConsonant(last);
          setLastIsVowel(false);
        } else if (VOWELS.includes(last)) {
          setLastIsVowel(true);
          setLastConsonant(null);
        } else {
          setLastConsonant(null);
          setLastIsVowel(false);
        }
        return updated;
      });
      onKeyPress("DEL");
    } else if (isKudlit(char)) {
      if (!lastConsonant || lastIsVowel) return;
      setLastConsonant(null);
      setLastIsVowel(false);
      setInputBuffer((prev) => prev + char);
      onKeyPress(char);
    } else {
      if (isConsonant(char)) {
        setLastConsonant(char);
        setLastIsVowel(false);
      } else if (VOWELS.includes(char)) {
        setLastIsVowel(true);
        setLastConsonant(null);
      } else {
        setLastIsVowel(false);
        setLastConsonant(null);
      }
      setInputBuffer((prev) => prev + char);
      onKeyPress(char);
    }
  };

  return (
    <View style={styles.keyboardContainer}>
      {KEY_ROWS.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((char) => {
            const isDisabled = isKudlit(char) && (!lastConsonant || lastIsVowel);
            const displayText =
              isKudlit(char) && lastConsonant
                ? lastConsonant + char
                : char === "SPACE"
                ? "␣"
                : char === "DEL"
                ? "⌫"
                : char;

            return (
              <Pressable
                key={char}
                onPress={() => !isDisabled && handleKeyPress(char)}
                style={({ pressed }) => [
                  styles.key,
                  char === "SPACE" && styles.spaceKey,
                  char === "DEL" && styles.delKey,
                  isDisabled && styles.disabledKey,
                  pressed && !isDisabled && styles.keyPressed,
                ]}
              >
                <Text
                  style={[
                    styles.keyText,
                    isDisabled && { color: "#bbb" },
                  ]}
                >
                  {displayText}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "#f7f7f7",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 2,
    flexWrap: "nowrap",
  },
  key: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  spaceKey: {
    width: 180,
  },
  delKey: {
    backgroundColor: "#ff3333ea",
  },
  keyText: {
    fontSize: 24,
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
  keyPressed: {
    backgroundColor: "#ddd",
    transform: [{ scale: 0.95 }],
  },
  disabledKey: {
    backgroundColor: Colors.PRIMARY,
  },
});
