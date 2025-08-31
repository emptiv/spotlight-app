import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

const CHARACTERS = [
  { symbol: "ᜀ", label: "A", type: "vowel" },
  { symbol: "ᜁ", label: "E/I", type: "vowel" },
  { symbol: "ᜂ", label: "O/U", type: "vowel" },
  { symbol: "ᜉ", label: "PA", type: "consonant" },
  { symbol: "ᜃ", label: "KA", type: "consonant" },
  { symbol: "ᜈ", label: "NA", type: "consonant" },
  { symbol: "ᜑ", label: "HA", type: "consonant" },
  { symbol: "ᜊ", label: "BA", type: "consonant" },
  { symbol: "ᜄ", label: "GA", type: "consonant" },
  { symbol: "ᜐ", label: "SA", type: "consonant" },
  { symbol: "ᜇ", label: "DA/RA", type: "consonant" },
  { symbol: "ᜆ", label: "TA", type: "consonant" },
  { symbol: "ᜅ", label: "NGA", type: "consonant" },
  { symbol: "ᜏ", label: "WA", type: "consonant" },
  { symbol: "ᜎ", label: "LA", type: "consonant" },
  { symbol: "ᜋ", label: "MA", type: "consonant" },
  { symbol: "ᜌ", label: "YA", type: "consonant" }
];

export default function PracticeUI() {
  const [filter, setFilter] = useState<"vowel" | "consonant">("vowel");

  const filteredCharacters = CHARACTERS.filter(char => char.type === filter);

  return (
    <View style={styles.container}>
      {/* Fake Header */}
      <View style={styles.fakeHeader}>
        <Ionicons name="menu" size={28} color={Colors.BLACK} />
        <Text style={styles.fakeHeaderTitle}>Practice</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="help-circle"
            size={30}
            color={Colors.BLACK}
            style={{ marginRight: 12 }}
          />
          <Ionicons
            name="chatbox-ellipses"
            size={26}
            color={Colors.BLACK}
            paddingTop={2.5}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice</Text>
          <Text style={styles.subtitle}>Scribble your way to mastery</Text>

          <View style={styles.buttonRow}>
            <Text
              style={[styles.toggleButtonText, filter === "vowel" && styles.activeButtonText]}
              onPress={() => setFilter("vowel")}
            >
              Vowels
            </Text>
            <Text
              style={[styles.toggleButtonText, filter === "consonant" && styles.activeButtonText]}
              onPress={() => setFilter("consonant")}
            >
              Consonants
            </Text>
          </View>
        </View>

        <FlatList
          data={filteredCharacters}
          numColumns={2}
          keyExtractor={(item) => item.label}
          contentContainerStyle={styles.grid}
          scrollEnabled={false} // flatlist is inside scrollview
          renderItem={({ item }) => (
            <View style={styles.tile}>
              <Text style={styles.character}>{item.symbol}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  fakeHeader: {
    height: 85,
    paddingTop: 25,
    backgroundColor: Colors.SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fakeHeaderTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.BLACK,
    paddingRight: 150,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 4,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.SECONDARY,
    borderRadius: 18,
    backgroundColor: Colors.WHITE,
    textAlign: "center",
  },
  activeButtonText: {
    fontFamily: "outfit-bold",
    backgroundColor: Colors.SECONDARY,
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
