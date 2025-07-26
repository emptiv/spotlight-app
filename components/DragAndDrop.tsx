import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Draggable,
  Droppable,
} from "react-native-reanimated-dnd";

interface DragAndDropProps {
  character: string;
  correctMarker: "Kudlit" | "Plus";
}

export default function DragAndDrop({ character, correctMarker }: DragAndDropProps) {
  const [isKudlitDropped, setIsKudlitDropped] = useState(false);
  const [isPlusDropped, setIsPlusDropped] = useState(false);
  const [dragKey] = useState(Date.now());

  return (
    <View style={styles.content}>
      {/* Stack: Top Drop, Character, Bottom Drop */}
      <View style={styles.characterStack}>
        <Droppable
          onDrop={(data: { title?: string }) => {
            if (data?.title === "Kudlit") setIsKudlitDropped(true);
            if (data?.title === "Plus") setIsPlusDropped(true);
          }}
          style={[styles.droppable, styles.topDropZone]}
        >
          <View style={styles.dropZone} />
        </Droppable>

        <Text style={styles.bigCharacter}>{character}</Text>

        <Droppable
          onDrop={(data: { title?: string }) => {
            if (data?.title === "Kudlit") setIsKudlitDropped(true);
            if (data?.title === "Plus") setIsPlusDropped(true);
          }}
          style={styles.droppable}
        >
          <View style={styles.dropZone} />
        </Droppable>
      </View>

      {/* Draggables Row */}
      <View style={styles.draggableContainer}>
        <View style={styles.draggableRow}>
          {/* Kudlit (•) */}
          <Draggable<{ title: string }>
            key={dragKey + "-kudlit"}
            data={{ title: "Kudlit" }}
            onDragEnd={() => setIsKudlitDropped(false)}
          >
            <View
              style={[
                styles.draggableItem,
                {
                  borderColor: isKudlitDropped
                    ? Colors.WHITE
                    : Colors.PRIMARY,
                },
              ]}
            >
              <Text style={styles.itemText}>•</Text>
            </View>
          </Draggable>

          {/* Plus (﹢) */}
          <Draggable<{ title: string }>
            key={dragKey + "-plus"}
            data={{ title: "Plus" }}
            onDragEnd={() => setIsPlusDropped(false)}
          >
            <View
              style={[
                styles.draggableItem,
                {
                  borderColor: isPlusDropped
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
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  characterStack: {
    alignItems: "center",
    gap: 1,
  },
  droppable: {
    height: 60,
    width: 60,
  },
  dropZone: {
    flex: 1,
    borderColor: Colors.PRIMARY,
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: Colors.GREY_LIGHT,
  },
  topDropZone: {
    marginBottom: -50,
  },
  bigCharacter: {
    fontSize: 250,
    color: Colors.PRIMARY,
    textAlign: "center",
    lineHeight: 210,
    includeFontPadding: false,
  },
  draggableContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  draggableRow: {
    flexDirection: "row",
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
    overflow: "hidden",
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
});
