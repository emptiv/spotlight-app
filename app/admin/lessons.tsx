import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminLessons() {
  const lessons = useQuery(api.adm_lessons.listLessons);
  const stats = useQuery(api.adm_lessons.getLessonStats);
  const addLesson = useMutation(api.adm_lessons.addLesson);
  const deleteLesson = useMutation(api.adm_lessons.deleteLesson);
  const updateLesson = useMutation(api.adm_lessons.updateLesson);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapter, setChapter] = useState("");
  const [order, setOrder] = useState("");

  if (!lessons || !stats) return <Text style={styles.loading}>Loading...</Text>;

  const handleAdd = async () => {
    if (!title || !description || !chapter || !order) return;
    await addLesson({
      title,
      description,
      chapter: Number(chapter),
      order: Number(order),
    });
    setTitle("");
    setDescription("");
    setChapter("");
    setOrder("");
  };

  return (
    <View style={styles.container}>
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalLessons}</Text>
          <Text style={styles.statLabel}>Total Lessons</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalChapters}</Text>
          <Text style={styles.statLabel}>Chapters</Text>
        </View>
      </View>

      {/* Add Lesson Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Lesson title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Lesson description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Chapter number"
          value={chapter}
          onChangeText={setChapter}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Order in chapter"
          value={order}
          onChangeText={setOrder}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Add Lesson</Text>
        </TouchableOpacity>
      </View>

      {/* Lessons List */}
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.lessonCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.lessonMeta}>
                Chapter {item.chapter} • Order {item.order}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() =>
                  updateLesson({
                    id: item._id,   // ✅ matches backend
                    title: item.title,
                    description: item.description,
                    chapter: item.chapter,
                    order: item.order,
                  })
                }
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => deleteLesson({ id: item._id })}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },

  // Form
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Lessons
  lessonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 1,
  },
  lessonTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  lessonDesc: { fontSize: 13, color: "#666", marginTop: 2 },
  lessonMeta: { fontSize: 12, color: "#999", marginTop: 4 },

  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editBtn: { backgroundColor: "#FFC107" },
  deleteBtn: { backgroundColor: "red" },
  btnText: { color: "#fff", fontWeight: "bold" },
});
