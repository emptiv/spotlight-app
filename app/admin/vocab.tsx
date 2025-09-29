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

  if (!vocab || !stats) return <Text style={styles.loading}>Loading...</Text>;

  const handleAdd = async () => {
    if (!latin || !baybayin) return;
    await createVocab({ latin, baybayin, difficulty, type });
    setLatin("");
    setBaybayin("");
    setShowForm(false);
  };

  const filtered =
    filterType === "all" ? vocab : vocab.filter((v) => v.type === filterType);

  const sections = ["easy", "medium", "hard"].map((diff) => ({
    title: diff.toUpperCase(),
    data: filtered.filter((v) => v.difficulty === diff),
  }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      ListHeaderComponent={
        <>
          <Text style={styles.pageTitle}>Vocabulary Management</Text>

          {/* Stats */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Easy</Text>
              <Text style={styles.statValue}>{stats.easy}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Medium</Text>
              <Text style={styles.statValue}>{stats.medium}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Hard</Text>
              <Text style={styles.statValue}>{stats.hard}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Words</Text>
              <Text style={styles.statValue}>{stats.words}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Phrases</Text>
              <Text style={styles.statValue}>{stats.phrases}</Text>
            </View>
          </View>

          {/* Add New Vocab Toggle */}
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setShowForm(!showForm)}
          >
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
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Baybayin"
                value={baybayin}
                onChangeText={setBaybayin}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Difficulty (easy, medium, hard)"
                value={difficulty}
                onChangeText={(val) =>
                  setDifficulty(val as "easy" | "medium" | "hard")
                }
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Type (word, phrase)"
                value={type}
                onChangeText={(val) => setType(val as "word" | "phrase")}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.addBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Filters */}
          <Text style={styles.sectionTitle}>Filter</Text>
          <View style={styles.filterBox}>
            {["all", "word", "phrase"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.filterBtn,
                  filterType === t && styles.filterBtnActive,
                ]}
                onPress={() => setFilterType(t as any)}
              >
                <Text
                  style={
                    filterType === t
                      ? styles.filterBtnTextActive
                      : styles.filterBtnText
                  }
                >
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Vocabulary</Text>
        </>
      }
      renderSectionHeader={({ section: { title } }) =>
        sectionHasItems(title, sections) && (
          <Text style={styles.sectionHeader}>{title}</Text>
        )
      }
      renderItem={({ item }) => (
        <View style={styles.vocabCard}>
          <View style={styles.vocabInfo}>
            <Text style={styles.vocabLatin}>{item.latin}</Text>
            <Text style={styles.vocabBaybayin}>{item.baybayin}</Text>
            <Text style={styles.vocabMeta}>{item.type}</Text>
          </View>
          <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              setLatin(item.latin);
              setBaybayin(item.baybayin);
              setDifficulty(item.difficulty);
              if (item.type === "word" || item.type === "phrase") {
                setType(item.type);
              }
              setShowForm(true);
            }}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>


            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteVocab({ id: item._id })}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

// Utility: hide empty sections
function sectionHasItems(title: string, sections: any[]) {
  const sec = sections.find((s) => s.title === title);
  return sec && sec.data.length > 0;
}

const styles = StyleSheet.create({
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },

  // Titles
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#444",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    color: "#666",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: { fontSize: 13, color: "#666", marginTop: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },

  // Toggle + Form
  toggleBtn: {
    marginBottom: 12,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleBtnText: { color: "#fff", fontWeight: "bold" },
  addBox: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  // Filters
  filterBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filterBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  filterBtnText: { color: "#333", fontSize: 13 },
  filterBtnTextActive: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  // Vocabulary cards
  vocabCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  vocabInfo: { flex: 1, marginRight: 12 },
  vocabLatin: { fontSize: 16, fontWeight: "600", color: "#333" },
  vocabMeta: { fontSize: 13, color: "#666", marginTop: 4 },

  // Actions
  deleteBtn: { backgroundColor: "red", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  vocabBaybayin: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#555", 
    marginTop: 2 
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#a09f9f", // gray like AdminUsers reset button
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },


});
