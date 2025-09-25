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
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

function SurveyStats({ surveyId }: { surveyId: string }) {
  const stats = useQuery(api.adm_surveys.surveyStats, { surveyId });

  if (!stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#6200ee" />
      </View>
    );
  }

  const renderUser = (u: any, answered = true) => {
    let details = `${u.email}`;
    if (answered && (u.course || u.year)) {
      details += ` • ${[u.course, u.year].filter(Boolean).join(", ")}`;
    }
    return (
      <View key={u.id} style={styles.userRow}>
        <Text style={styles.userName}>{u.name || "Unnamed"}</Text>
        <Text style={styles.userDetails}>{details}</Text>
      </View>
    );
  };

  return (
    <View style={styles.statsBlock}>
      <Text style={styles.statsHeader}>📊 Survey Stats</Text>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.totalUsers}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#E6F4EA" }]}>
          <Text style={[styles.summaryNumber, { color: "#2E7D32" }]}>
            {stats.answeredCount}
          </Text>
          <Text style={[styles.summaryLabel, { color: "#2E7D32" }]}>
            Answered
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#FFEBEE" }]}>
          <Text style={[styles.summaryNumber, { color: "#C62828" }]}>
            {stats.notAnsweredCount}
          </Text>
          <Text style={[styles.summaryLabel, { color: "#C62828" }]}>
            Not Answered
          </Text>
        </View>
      </View>

      {/* Answered list */}
      <Text style={styles.subHeader}>✅ Answered</Text>
      {stats.answered.length > 0 ? (
        stats.answered.map((u: any) => renderUser(u, true))
      ) : (
        <Text style={styles.emptyList}>No responses yet.</Text>
      )}

      {/* Not answered list */}
      <Text style={styles.subHeader}>❌ Not Answered</Text>
      {stats.notAnswered.length > 0 ? (
        stats.notAnswered.map((u: any) => renderUser(u, false))
      ) : (
        <Text style={styles.emptyList}>Everyone has answered 🎉</Text>
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

  // Add new question
  const [newEn, setNewEn] = useState("");
  const [newFil, setNewFil] = useState("");
  const [newType, setNewType] = useState<"likert" | "open">("likert");

  if (surveys === undefined) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const handleSave = async (id: Id<"survey_questions">) => {
    await updateQuestion({
      id,
      text: { en: editTextEn, fil: editTextFil },
    });
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
    <View style={styles.container}>
      <Text style={styles.header}>📋 Manage Surveys</Text>

      <FlatList
        data={surveys}
        keyExtractor={(survey) => survey._id.toString()}
        renderItem={({ item: survey }) => (
          <View style={styles.surveyBlock}>
            <Text style={styles.surveyTitle}>{survey.title}</Text>

            {/* Add new question */}
            <View style={styles.card}>
              <TextInput
                style={styles.input}
                value={newEn}
                onChangeText={setNewEn}
                placeholder="New question (English)"
              />
              <TextInput
                style={styles.input}
                value={newFil}
                onChangeText={setNewFil}
                placeholder="New question (Filipino)"
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

            {/* List questions */}
            {survey.questions.map((q: any) => (
              <View key={q._id.toString()} style={styles.card}>
                {editingId === q._id ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={editTextEn}
                      onChangeText={setEditTextEn}
                      placeholder="Edit English text"
                    />
                    <TextInput
                      style={styles.input}
                      value={editTextFil}
                      onChangeText={setEditTextFil}
                      placeholder="Edit Filipino text"
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
          <Text style={styles.empty}>No surveys found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fafafa" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  surveyBlock: { marginBottom: 24 },
  surveyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  picker: { marginBottom: 8 },
  info: { fontSize: 15, marginBottom: 6 },
  type: { fontSize: 14, color: "#666", marginBottom: 6 },
  bold: { fontWeight: "bold" },
  rowButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  editButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editText: { color: "#fff", fontWeight: "600" },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: { color: "#fff", fontWeight: "600" },
  addButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  addText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  saveText: { color: "#fff", fontWeight: "600" },
  cancelButton: {
    backgroundColor: "#9E9E9E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", fontSize: 16, color: "#777", marginTop: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  statsBlock: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  statsHeader: { fontWeight: "bold", marginBottom: 4 },
  subHeader: { marginTop: 10, fontWeight: "600" },
  userItem: { fontSize: 14, marginTop: 2 },
  emptyList: { fontSize: 14, color: "#777", fontStyle: "italic" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  userRow: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#eee",
  },
  userName: { fontWeight: "600", fontSize: 14, marginBottom: 2 },
  userDetails: { fontSize: 13, color: "#555" },

});

