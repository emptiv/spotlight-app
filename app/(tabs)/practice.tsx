import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../../components/LanguageContext";

const CHARACTERS = [
  { symbol: "ᜀ", label: "A", value: "a", type: "vowel" },
  { symbol: "ᜁ", label: "E/I", value: "e_i", type: "vowel" },
  { symbol: "ᜂ", label: "O/U", value: "o_u", type: "vowel" },

  { symbol: "ᜉ", label: "PA", value: "pa", type: "consonant" },
  { symbol: "ᜃ", label: "KA", value: "ka", type: "consonant" },
  { symbol: "ᜈ", label: "NA", value: "na", type: "consonant" },

  { symbol: "ᜑ", label: "HA", value: "ha", type: "consonant" },
  { symbol: "ᜊ", label: "BA", value: "ba", type: "consonant" },
  { symbol: "ᜄ", label: "GA", value: "ga", type: "consonant" },

  { symbol: "ᜐ", label: "SA", value: "sa", type: "consonant" },
  { symbol: "ᜇ", label: "DA/RA", value: "da_ra", type: "consonant" },
  { symbol: "ᜆ", label: "TA", value: "ta", type: "consonant" },

  { symbol: "ᜅ", label: "NGA", value: "nga", type: "consonant" },
  { symbol: "ᜏ", label: "WA", value: "wa", type: "consonant" },
  { symbol: "ᜎ", label: "LA", value: "la", type: "consonant" },

  { symbol: "ᜋ", label: "MA", value: "ma", type: "consonant" },
  { symbol: "ᜌ", label: "YA", value: "ya", type: "consonant" }
];

export default function Practice() {
  const router = useRouter();
  const [filter, setFilter] = useState<"vowel" | "consonant">("vowel");
  const { lang } = useLanguage();

  const t = {
    en: {
      practice: "Practice",
      subtitle: "Scribble your way to mastery",
      vowels: "Vowels",
      consonants: "Consonants",
    },
    fil: {
      practice: "Sanayin",
      subtitle: "Magsanay sa pagsusulat",
      vowels: "Patinig",
      consonants: "Katinig",
    },
  }[lang];

  const filteredCharacters = CHARACTERS.filter((char) => char.type === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.practice}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.toggleButton, filter === "vowel" && styles.activeButton]}
            onPress={async () => {
              await playSound('click');
              setFilter("vowel");
            }}
          >
            <Text
              style={[
                styles.toggleButtonText,
                filter === "vowel" && styles.activeButtonText,
              ]}
            >
              {t.vowels}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, filter === "consonant" && styles.activeButton]}
            onPress={async () => {
              await playSound('click');
              setFilter("consonant");
            }}
          >
            <Text
              style={[
                styles.toggleButtonText,
                filter === "consonant" && styles.activeButtonText,
              ]}
            >
              {t.consonants}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredCharacters}
        numColumns={2}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={async () => {
              await playSound('click');
              router.push({ pathname: "/practice/[char]", params: { char: item.value } });
            }}
          >
            <Text style={styles.character}>{item.symbol}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 16,
    paddingBottom: 1,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginTop: 16,
    marginLeft: 8,
    marginBottom: -17,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginLeft: 8,
    marginBottom: 15,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.SECONDARY,
    backgroundColor: Colors.WHITE,
  },
  activeButton: {
    backgroundColor: Colors.SECONDARY,
  },
  toggleButtonText: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
  activeButtonText: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
  grid: {
    justifyContent: "space-between",
  },
  tile: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    margin: 8,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    alignItems: "center",
    paddingVertical: 24,

    // iOS Shadow
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
  character: {
    fontSize: 80,
    color: Colors.BLACK,
    fontFamily: "outfit-bold",
  },
  label: {
    fontSize: 18,
    color: Colors.BLACK,
    fontFamily: "outfit",
    marginTop: 8,
  },
});
