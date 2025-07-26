import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Draggable,
  DropProvider,
  Droppable,
} from "react-native-reanimated-dnd";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "@/constants/Colors";

// --------------------
// Types
// --------------------
type TextPage = {
  type: "text";
  content: string;
};

type DragPage = {
  type: "drag";
  character: string;
  correctMarker: "Kudlit" | "Plus";
  correctDrop: "top" | "bottom";
};

type LessonPage = TextPage | DragPage;

// --------------------
// Data
// --------------------
const lessonData: LessonPage[] = [
  {
    type: "text",
    content: "Let's learn about Kudlit markers placed above the character.",
  },
  {
    type: "drag",
    character: "ᜉ",
    correctDrop: "top",
    correctMarker: "Kudlit",
  },
  {
    type: "text",
    content: "Now observe the Kudlit marker when placed below.",
  },
  {
    type: "drag",
    character: "ᜇ",
    correctDrop: "bottom",
    correctMarker: "Kudlit",
  },
  {
    type: "text",
    content: "Lastly, let's try a Plus sign marker for this character.",
  },
  {
    type: "drag",
    character: "ᜅ",
    correctDrop: "bottom",
    correctMarker: "Plus",
  },
];

// --------------------
// Component
// --------------------
export default function LessonDragScreen() {
  const [index, setIndex] = useState(0);
  const [dragKey, setDragKey] = useState(Date.now());
  const [droppedZone, setDroppedZone] = useState<"top" | "bottom" | null>(null);
  const [droppedMarker, setDroppedMarker] = useState<"Kudlit" | "Plus" | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const router = useRouter();
  const isLast = index === lessonData.length - 1;
  const currentPage = lessonData[index];

  const handleNext = () => {
    if (!isAnswerCorrect && currentPage.type === "drag") return;

    if (isLast) {
      router.replace("../(tabs)/profile");
    } else {
      setIndex((prev) => prev + 1);
      setDroppedMarker(null);
      setDroppedZone(null);
      setIsAnswerCorrect(false);
      setShowWrong(false);
      setDragKey(Date.now());
    }
  };

  const renderDragPage = (page: DragPage) => {
    const handleDrop = (zone: "top" | "bottom", data: { title?: string }) => {
      if (!data?.title) return;

      const marker = data.title as "Kudlit" | "Plus";
      setDroppedZone(zone);
      setDroppedMarker(marker);

      const correct = marker === page.correctMarker && zone === page.correctDrop;
      setIsAnswerCorrect(correct);
      setShowWrong(!correct);

      if (!correct) {
        setTimeout(() => {
          setDragKey(Date.now()); // reset draggable
          setDroppedZone(null);
          setDroppedMarker(null);
          setShowWrong(false);
        }, 700);
      }
    };

    return (
      <View style={styles.scrollContent}>
        <View style={styles.characterStack}>
          <Droppable
            key="top-zone"
            onDrop={(data: { title?: string }) => handleDrop("top", data)}
            style={styles.droppable}
          >
            <View
              style={[
                styles.dropZone,
                showWrong && droppedZone === "top" && styles.dropZoneWrong,
                isAnswerCorrect &&
                  page.correctDrop === "top" &&
                  styles.dropZoneCorrect,
              ]}
            />
          </Droppable>

          <Text style={styles.bigCharacter}>{page.character}</Text>

          <Droppable
            key="bottom-zone"
            onDrop={(data: { title?: string }) => handleDrop("bottom", data)}
            style={styles.droppable}
          >
            <View
              style={[
                styles.dropZone,
                showWrong && droppedZone === "bottom" && styles.dropZoneWrong,
                isAnswerCorrect &&
                  page.correctDrop === "bottom" &&
                  styles.dropZoneCorrect,
              ]}
            />
          </Droppable>
        </View>

        <View style={styles.draggableRow}>
          <Draggable<{ title: "Kudlit" }>
            key={dragKey + "-kudlit"}
            data={{ title: "Kudlit" }}
          >
            <View
              style={[
                styles.draggableItem,
                {
                  borderColor:
                    droppedMarker === "Kudlit" && isAnswerCorrect
                      ? Colors.WHITE
                      : Colors.PRIMARY,
                },
              ]}
            >
              <Text style={styles.itemText}>•</Text>
            </View>
          </Draggable>

          <Draggable<{ title: "Plus" }>
            key={dragKey + "-plus"}
            data={{ title: "Plus" }}
          >
            <View
              style={[
                styles.draggableItem,
                {
                  borderColor:
                    droppedMarker === "Plus" && isAnswerCorrect
                      ? Colors.WHITE
                      : Colors.PRIMARY,
                },
              ]}
            >
              <Text style={styles.plusItemText}>+</Text>
            </View>
          </Draggable>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <DropProvider>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {currentPage.type === "text" ? (
              <Text style={styles.lessonText}>{currentPage.content}</Text>
            ) : (
              renderDragPage(currentPage)
            )}

            <TouchableOpacity
              style={[
                styles.button,
                currentPage.type === "drag" && !isAnswerCorrect && styles.buttonDisabled,
              ]}
              onPress={handleNext}
              disabled={currentPage.type === "drag" && !isAnswerCorrect}
            >
              <Text style={styles.buttonText}>
                {isLast ? "Finish" : "Next"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </DropProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  lessonText: {
    fontSize: 20,
    color: Colors.PRIMARY,
    textAlign: "center",
    fontFamily: "outfit-medium",
  },
  characterStack: {
    alignItems: "center",
    gap: 1,
    marginBottom: 30,
  },
  droppable: {
    height: 60,
    width: 60,
  },
  dropZone: {
    flex: 1,
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: Colors.GREY_LIGHT,
  },
  dropZoneWrong: {
    borderColor: "red",
    backgroundColor: "#ffe5e5",
  },
  dropZoneCorrect: {
    borderColor: "green",
    backgroundColor: "#e5ffe5",
  },
  bigCharacter: {
    fontSize: 250,
    color: Colors.PRIMARY,
    textAlign: "center",
    lineHeight: 210,
    includeFontPadding: false,
  },
  draggableRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  draggableItem: {
    height: 61,
    width: 61,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 2,
  },
  itemText: {
    color: Colors.PRIMARY,
    fontSize: 70,
    textAlign: "center",
    lineHeight: 61,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  plusItemText: {
    color: Colors.PRIMARY,
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 23,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  button: {
    marginTop: 40,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
});
