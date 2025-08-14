import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLanguage } from "../../components/LanguageContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Flashcard = { front: string; back: string };

const kudlitMarks = {
  I: "ᜒ",
  O: "ᜓ",
};

const virama = "᜔";

const basicVowels: Flashcard[] = [
  { front: "ᜀ", back: "A" },
  { front: "ᜁ", back: "E/I" },
  { front: "ᜂ", back: "O/U" },
];

const basicConsonants: Flashcard[] = [
  { front: "ᜃ", back: "KA" },
  { front: "ᜄ", back: "GA" },
  { front: "ᜅ", back: "NGA" },
  { front: "ᜆ", back: "TA" },
  { front: "ᜇ", back: "DA/RA" },
  { front: "ᜈ", back: "NA" },
  { front: "ᜉ", back: "PA" },
  { front: "ᜊ", back: "BA" },
  { front: "ᜋ", back: "MA" },
  { front: "ᜌ", back: "YA" },
  { front: "ᜎ", back: "LA" },
  { front: "ᜏ", back: "WA" },
  { front: "ᜐ", back: "SA" },
  { front: "ᜑ", back: "HA" },
];

const kudlit: Flashcard[] = basicConsonants.flatMap(({ front, back }) => {
  const base = back.split("/")[0][0];
  return [
    { front: front + kudlitMarks.I, back: `${base}E/${base}I` },
    { front: front + kudlitMarks.O, back: `${base}O/${base}U` },
  ];
});

const krusKudlit: Flashcard[] = basicConsonants.map(({ front, back }) => {
  const base = back.split("/")[0][0];
  return {
    front: front + virama,
    back: `${base}`,
  };
});

const allDecks = {
  vowels: basicVowels,
  consonants: basicConsonants,
  kudlit,
  krusKudlit,
};

export default function FlashcardsScreen() {
  const router = useRouter();
  const [mainCategory, setMainCategory] = useState<"vowels" | "consonants">("vowels");
  const [subCategory, setSubCategory] = useState<"kudlit" | "krusKudlit" | null>(null);
  const [index, setIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[] | null>(null);

  const rotateY = useSharedValue(0);

  const { lang } = useLanguage();

  const t = {
    en: {
      vowels: "Vowels",
      consonants: "Consonants",
      kudlit: "Kudlit",
      krusKudlit: "Krus-Kudlit",
      shuffle: "Shuffle",
      shuffleOn: "Shuffle: On",
      shuffleOff: "Shuffle: Off",
      flipInstruction: "Tap the card to flip",
    },
    fil: {
      vowels: "Patinig",
      consonants: "Katinig",
      kudlit: "Kudlit",
      krusKudlit: "Krus-Kudlit",
      shuffle: "Shuffle",
      shuffleOn: "Shuffle: On",
      shuffleOff: "Shuffle: Off",
      flipInstruction: "I-tap ang kard upang baliktarin",
    },
  }[lang];

  const rawCards = useMemo(() => {
    if (mainCategory === "vowels") return allDecks.vowels;
    if (subCategory) return allDecks[subCategory];
    return allDecks.consonants;
  }, [mainCategory, subCategory]);

  const cards = isShuffled ? shuffledCards || rawCards : rawCards;

  const current = cards[index];

  const shuffleArray = (array: Flashcard[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % cards.length);
    rotateY.value = 0;
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    rotateY.value = 0;
  };

  const handleMainCategory = (cat: "vowels" | "consonants") => {
    setMainCategory(cat);
    setSubCategory(null);
    setShuffledCards(null);
    setIsShuffled(false);
    setIndex(0);
    rotateY.value = 0;
  };

  const handleSubCategory = (sub: "kudlit" | "krusKudlit") => {
    setSubCategory(sub);
    setShuffledCards(null);
    setIsShuffled(false);
    setIndex(0);
    rotateY.value = 0;
  };

  const toggleShuffle = () => {
    if (!isShuffled) {
      const newShuffled = shuffleArray(rawCards);
      setShuffledCards(newShuffled);
      setIndex(0);
    } else {
      setShuffledCards(null);
      setIndex(0);
    }
    setIsShuffled((prev) => !prev);
    rotateY.value = 0;
  };

  const flipCard = () => {
    const isFront = rotateY.value === 0;
    rotateY.value = withTiming(isFront ? 180 : 0, { duration: 300 });
  };

  useEffect(() => {
    setShuffledCards(null);
    setIndex(0);
  }, [mainCategory, subCategory]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotateY.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotate}deg` }],
      backfaceVisibility: "hidden",
      position: "absolute",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotateY.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotate}deg` }],
      backfaceVisibility: "hidden",
      position: "absolute",
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        {/* Main Deck Selection */}
        <View style={styles.deckSelector}>
          <Pressable onPress={() => handleMainCategory("vowels")}>
            <View style={[styles.deckButton, mainCategory === "vowels" && styles.activeDeckButton]}>
              <Text style={[styles.deckButtonText, mainCategory === "vowels" && styles.activeDeckText]}>{t.vowels}</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => handleMainCategory("consonants")}>
            <View style={[styles.deckButton, mainCategory === "consonants" && !subCategory && styles.activeDeckButton]}>
              <Text style={[styles.deckButtonText, mainCategory === "consonants" && !subCategory && styles.activeDeckText]}>{t.consonants}</Text>
            </View>
          </Pressable>
        </View>

        {/* Subcategory */}
        {mainCategory === "consonants" && (
          <View style={styles.deckSelector}>
            <Pressable onPress={() => handleSubCategory("kudlit")}>
              <View style={[styles.deckButton, subCategory === "kudlit" && styles.activeDeckButton]}>
                <Text style={[styles.deckButtonText, subCategory === "kudlit" && styles.activeDeckText]}>{t.kudlit}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => handleSubCategory("krusKudlit")}>
              <View style={[styles.deckButton, subCategory === "krusKudlit" && styles.activeDeckButton]}>
                <Text style={[styles.deckButtonText, subCategory === "krusKudlit" && styles.activeDeckText]}>{t.krusKudlit}</Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Flashcard */}
        <View style={styles.centerContent}>
          <Text style={styles.deckTitleText}>
            {subCategory
              ? subCategory === "kudlit"
                ? t.kudlit
                : t.krusKudlit
              : mainCategory === "vowels"
              ? t.vowels
              : t.consonants}
          </Text>

          <Pressable onPress={flipCard}>
            <View style={styles.cardWrapper}>
              <Animated.View style={[styles.card, frontAnimatedStyle]}>
                <Text style={styles.cardText}>{current.front}</Text>
              </Animated.View>
              <Animated.View style={[styles.card, backAnimatedStyle]}>
                <Text style={styles.cardText}>{current.back}</Text>
              </Animated.View>
            </View>
          </Pressable>

          <View style={styles.navButtons}>
            <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
              <Ionicons name="chevron-back-circle-outline" size={40} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.counter}>{index + 1} / {cards.length}</Text>
            <TouchableOpacity onPress={handleNext} style={styles.navButton}>
              <Ionicons name="chevron-forward-circle-outline" size={40} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={toggleShuffle}
            style={[styles.shuffleButton, isShuffled && styles.shuffleButtonActive]}
          >
            <Text style={[styles.shuffleButtonText, isShuffled && styles.shuffleButtonTextActive]}>
              {isShuffled ? t.shuffleOn : t.shuffleOff}
            </Text>
          </TouchableOpacity>

          <Text style={styles.instruction}>{t.flipInstruction}</Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  deckSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 10,
  },
  deckButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  activeDeckButton: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  deckButtonText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
  activeDeckText: {
    color: "white",
  },
  centerContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 40,
  },
  deckTitleText: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.PRIMARY,
    marginBottom: 20,
  },
  cardWrapper: {
    width: SCREEN_WIDTH - 60,
    height: 220,
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardText: {
    fontSize: 38,
    color: "white",
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  navButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  counter: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  instruction: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 10,
  },
  shuffleButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  shuffleButtonActive: {
    backgroundColor: Colors.PRIMARY,
  },
  shuffleButtonText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.PRIMARY,
  },
  shuffleButtonTextActive: {
    color: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
