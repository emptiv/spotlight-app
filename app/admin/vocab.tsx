import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminVocab() {
  const vocab = useQuery(api.adm_lessons.listVocab);
  const stats = useQuery(api.adm_lessons.getVocabStats);
  const createVocab = useMutation(api.adm_lessons.createVocab);
  const deleteVocab = useMutation(api.adm_lessons.deleteVocab);

  const [latin, setLatin] = useState("");
  const [baybayin, setBaybayin] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [type, setType] = useState<"word" | "phrase">("word");
  const [filterType, setFilterType] = useState<"all" | "word" | "phrase">("all");
  const [showForm, setShowForm] = useState(false);

  if (!vocab || !stats) return <Text>Loading...</Text>;

  const handleAdd = async () => {
    if (!latin || !baybayin) return;
    await createVocab({ latin, baybayin, difficulty, type });
    setLatin("");
    setBaybayin("");
    setShowForm(false);
  };

  // --- Filtering ---
  const filtered = filterType === "all" ? vocab : vocab.filter((v) => v.type === filterType);

  // --- Group vocab by difficulty ---
  const sections = ["easy", "medium", "hard"].map((diff) => ({
    title: diff.toUpperCase(),
    data: filtered.filter((v) => v.difficulty === diff),
  }));

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardValue}>{stats.total}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Easy</Text>
          <Text style={styles.cardValue}>{stats.easy}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medium</Text>
          <Text style={styles.cardValue}>{stats.medium}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hard</Text>
          <Text style={styles.cardValue}>{stats.hard}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Words</Text>
          <Text style={styles.cardValue}>{stats.words}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Phrases</Text>
          <Text style={styles.cardValue}>{stats.phrases}</Text>
        </View>
      </View>

      {/* Add New Vocab Toggle */}
      <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.toggleBtnText}>
          {showForm ? "Cancel" : "+ Add New Vocab"}
        </Text>
      </TouchableOpacity>

      {/* Add New Vocab Form */}
      {showForm && (
        <View style={styles.addBox}>
          <TextInput
            style={styles.input}
            placeholder="Latin"
            value={latin}
            onChangeText={setLatin}
          />
          <TextInput
            style={styles.input}
            placeholder="Baybayin"
            value={baybayin}
            onChangeText={setBaybayin}
          />
          <TextInput
            style={styles.input}
            placeholder="Difficulty (easy, medium, hard)"
            value={difficulty}
            onChangeText={(val) => setDifficulty(val as "easy" | "medium" | "hard")}
          />
          <TextInput
            style={styles.input}
            placeholder="Type (word, phrase)"
            value={type}
            onChangeText={(val) => setType(val as "word" | "phrase")}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Controls */}
      <View style={styles.filterBox}>
        {["all", "word", "phrase"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterBtn, filterType === t && styles.filterBtnActive]}
            onPress={() => setFilterType(t as any)}
          >
            <Text style={filterType === t ? styles.filterBtnTextActive : styles.filterBtnText}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vocabulary List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderSectionHeader={({ section: { title } }) =>
          sectionHasItems(title, sections) && (
            <Text style={styles.sectionHeader}>{title}</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>
              {item.latin} ↔ {item.baybayin} ({item.type})
            </Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteVocab({ id: item._id })}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Utility: hide empty sections
function sectionHasItems(title: string, sections: any[]) {
  const sec = sections.find((s) => s.title === title);
  return sec && sec.data.length > 0;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cardTitle: { fontSize: 12, color: "#555" },
  cardValue: { fontSize: 18, fontWeight: "bold" },

  // Toggle button
  toggleBtn: {
    marginBottom: 12,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleBtnText: { color: "#fff", fontWeight: "bold" },

  // Add vocab form
  addBox: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },

  // Filters
  filterBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  filterBtnText: { color: "#333" },
  filterBtnTextActive: { color: "#fff", fontWeight: "bold" },

  // List
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: { flex: 1 },
  deleteBtn: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteBtnText: { color: "#fff" },
});
