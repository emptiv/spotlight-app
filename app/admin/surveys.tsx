import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

function SurveyStats({ surveyId }: { surveyId: string }) {
  const stats = useQuery(api.adm_surveys.surveyStats, { surveyId });

  if (!stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  const renderUser = (u: any, answered = true) => {
    let details = `${u.email}`;
    if (answered && (u.course || u.year)) {
      details += ` • ${[u.course, u.year].filter(Boolean).join(", ")}`;
    }
    return (
      <View key={u.id} style={styles.userCard}>
        <Text style={styles.userName}>{u.name || "Unnamed"}</Text>
        <Text style={styles.userDetails}>{details}</Text>
      </View>
    );
  };

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>Survey Stats</Text>

      {/* Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#E6F4EA" }]}>
          <Text style={[styles.statValue, { color: "#2E7D32" }]}>
            {stats.answeredCount}
          </Text>
          <Text style={[styles.statLabel, { color: "#2E7D32" }]}>
            Answered
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFEBEE" }]}>
          <Text style={[styles.statValue, { color: "#C62828" }]}>
            {stats.notAnsweredCount}
          </Text>
          <Text style={[styles.statLabel, { color: "#C62828" }]}>
            Not Answered
          </Text>
        </View>
      </View>

      {/* Answered */}
      <Text style={styles.subHeader}>Answered</Text>
      {stats.answered.length > 0 ? (
        stats.answered.map((u: any) => renderUser(u, true))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No responses yet.</Text>
        </View>
      )}

      {/* Not answered */}
      <Text style={styles.subHeader}>Not Answered</Text>
      {stats.notAnswered.length > 0 ? (
        stats.notAnswered.map((u: any) => renderUser(u, false))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Everyone has answered</Text>
        </View>
      )}
    </View>
  );
}

export default function SurveysScreen() {
  const surveys = useQuery(api.adm_surveys.getAll);
  const addQuestion = useMutation(api.adm_surveys.addQuestion);
  const updateQuestion = useMutation(api.adm_surveys.updateQuestion);
  const removeQuestion = useMutation(api.adm_surveys.removeQuestion);

  const [editingId, setEditingId] = useState<Id<"survey_questions"> | null>(
    null
  );
  const [editTextEn, setEditTextEn] = useState("");
  const [editTextFil, setEditTextFil] = useState("");

  const [newEn, setNewEn] = useState("");
  const [newFil, setNewFil] = useState("");
  const [newType, setNewType] = useState<"likert" | "open">("likert");

  if (!surveys) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleSave = async (id: Id<"survey_questions">) => {
    await updateQuestion({ id, text: { en: editTextEn, fil: editTextFil } });
    setEditingId(null);
    setEditTextEn("");
    setEditTextFil("");
  };

  const handleAdd = async (surveyId: string) => {
    if (!newEn.trim() || !newFil.trim()) return;

    const order =
      surveys.find((s) => s._id === surveyId)?.questions.length || 0;

    await addQuestion({
      surveyId,
      questionId: `${surveyId}-${Date.now()}`,
      text: { en: newEn, fil: newFil },
      type: newType,
      order,
    });

    setNewEn("");
    setNewFil("");
    setNewType("likert");
  };

  return (
    <FlatList
      data={surveys}
      keyExtractor={(s) => s._id.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.pageTitle}>Manage Survey</Text>}
      renderItem={({ item: survey }) => (
        <View style={styles.sectionBlock}>

          {/* Add new question */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              value={newEn}
              onChangeText={setNewEn}
              placeholder="New question (English)"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={newFil}
              onChangeText={setNewFil}
              placeholder="New question (Filipino)"
              placeholderTextColor="#999"
            />
            <Picker
              selectedValue={newType}
              onValueChange={(val) => setNewType(val)}
              style={styles.picker}
            >
              <Picker.Item label="Likert Scale" value="likert" />
              <Picker.Item label="Open-ended" value="open" />
            </Picker>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAdd(survey._id)}
            >
              <Text style={styles.addText}>+ Add Question</Text>
            </TouchableOpacity>
          </View>

          {/* Questions */}
          {survey.questions.map((q: any) => (
            <View key={q._id.toString()} style={styles.card}>
              {editingId === q._id ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={editTextEn}
                    onChangeText={setEditTextEn}
                    placeholder="Edit English text"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    style={styles.input}
                    value={editTextFil}
                    onChangeText={setEditTextFil}
                    placeholder="Edit Filipino text"
                    placeholderTextColor="#999"
                  />
                  <View style={styles.rowButtons}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSave(q._id)}
                    >
                      <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setEditingId(null);
                        setEditTextEn("");
                        setEditTextFil("");
                      }}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.info}>
                    <Text style={styles.bold}>EN:</Text> {q.text.en}
                  </Text>
                  <Text style={styles.info}>
                    <Text style={styles.bold}>FIL:</Text> {q.text.fil}
                  </Text>
                  <Text style={styles.type}>
                    Type: {q.type === "likert" ? "Likert Scale" : "Open-ended"}
                  </Text>
                  <View style={styles.rowButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setEditingId(q._id);
                        setEditTextEn(q.text.en);
                        setEditTextFil(q.text.fil);
                      }}
                    >
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeQuestion({ id: q._id })}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}

          {/* Stats */}
          <SurveyStats surveyId={survey._id} />
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No surveys found.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  pageTitle: { fontSize: 28, fontWeight: "bold", color: "#007AFF", marginBottom: 16 },

  sectionBlock: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#007AFF", marginBottom: 12 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  picker: { marginBottom: 12 },

  info: { fontSize: 15, marginBottom: 6 },
  type: { fontSize: 14, color: "#666", marginBottom: 6 },
  bold: { fontWeight: "bold" },

  rowButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  editButton: { backgroundColor: "#2196F3", padding: 10, borderRadius: 8, marginRight: 8 },
  editText: { color: "#fff", fontWeight: "600" },
  deleteButton: { backgroundColor: "#f44336", padding: 10, borderRadius: 8 },
  deleteText: { color: "#fff", fontWeight: "600" },

  addButton: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8 },
  addText: { color: "#fff", fontWeight: "600", textAlign: "center" },

  saveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 8, marginRight: 8 },
  saveText: { color: "#fff", fontWeight: "600" },
  cancelButton: { backgroundColor: "#9E9E9E", padding: 10, borderRadius: 8 },
  cancelText: { color: "#fff", fontWeight: "600" },

  // Survey stats
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  statLabel: { fontSize: 14, color: "#555" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },

  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  userName: { fontWeight: "600", fontSize: 15, marginBottom: 2, color: "#333" },
  userDetails: { fontSize: 13, color: "#555" },

  subHeader: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 6 },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
    alignItems: "center",
  },
  emptyText: { color: "#777", fontStyle: "italic", fontSize: 14, textAlign: "center" },
});
