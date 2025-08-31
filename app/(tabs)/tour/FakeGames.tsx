import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FakeSpellingAndCards() {
  const t = {
    title: "Mini Games",
    subtitle: "Challenge your skills",
    spellingTitle: "Spelling Exercise",
    spellingSub: "Test words in Baybayin",
    flashcardTitle: "Offline Flashcards",
    flashcardSub: "Review characters anywhere",
    start: "Start",
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Fake Header */}
      <View style={styles.fakeHeader}>
        <Ionicons name="menu" size={28} color={Colors.BLACK} />
        <Text style={styles.fakeHeaderTitle}>Home</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons name="help-circle" size={30} color={Colors.BLACK} style={{ marginRight: 12 }} />
          <Ionicons name="chatbox-ellipses" size={26} color={Colors.BLACK} paddingTop={2.5} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {/* Spelling Card */}
        <View style={[styles.card, styles.card3]}>
          <View style={styles.card3Group}>
            <Text style={styles.cardText}>{t.spellingTitle}</Text>
            <Text style={styles.cardSubtitle}>{t.spellingSub}</Text>
            <View style={styles.card3Button}>
              <Text style={styles.buttonText}>{t.start}</Text>
            </View>
          </View>
          <Image
            source={require("@/assets/images/spelling.png")}
            style={styles.card3Image}
            resizeMode="contain"
          />
        </View>

        {/* Flashcard Card */}
        <View style={[styles.card, styles.card3]}>
          <View style={styles.card3Group}>
            <Text style={styles.cardText}>{t.flashcardTitle}</Text>
            <Text style={styles.cardSubtitle}>{t.flashcardSub}</Text>
            <View style={styles.card3Button}>
              <Text style={styles.buttonText}>{t.start}</Text>
            </View>
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
  scrollContainer: {
    backgroundColor: Colors.WHITE,
    flexGrow: 1,
  },
  contentWrapper: {
    padding: 24,
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
  title: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 33,
  },
  card: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    height: 140,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
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
    bottom: -10,
    right: -20,
  },
});
