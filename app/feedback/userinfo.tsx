import Colors from "@/constants/Colors";
import { playSound } from "@/constants/playClickSound";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SURVEY_ID = "plumatika"; // <-- same as in Intro

export default function UserInfoForm() {
  const { userId } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!course.trim() || !year.trim()) {
      Alert.alert("Missing Info", "Course/Strand and Year are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      await playSound("click");

      // ✅ Pass user info to feedback survey
      router.push({
        pathname: "/feedback/survey",
        params: { userId, surveyId: SURVEY_ID, name, course, year },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={50}
    >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={async () => {
            await playSound("click");
            router.replace("/(tabs)");
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Tell Us About Yourself</Text>
        <Text style={styles.description}>
          Please provide a few details before starting the feedback survey.
        </Text>

        <View style={styles.card}>
          {/* Name (optional) */}
          <Text style={styles.label}>Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />

          {/* Course/Strand (required) */}
          <Text style={styles.label}>Course / Strand *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your course or strand"
            value={course}
            onChangeText={setCourse}
            placeholderTextColor="#999"
          />

          {/* Year (required, dropdown) */}
          <Text style={styles.label}>Year Level *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={year}
              onValueChange={(value) => setYear(value)}
            >
              <Picker.Item label="Select year level..." value="" />
              <Picker.Item label="G11" value="G11" />
              <Picker.Item label="G12" value="G12" />
              <Picker.Item label="1Y" value="1Y" />
              <Picker.Item label="2Y" value="2Y" />
              <Picker.Item label="3Y" value="3Y" />
              <Picker.Item label="4Y" value="4Y" />
            </Picker>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.button,
            (isSubmitting || !course.trim() || !year.trim()) && { opacity: 0.5 },
          ]}
          disabled={isSubmitting || !course.trim() || !year.trim()}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Processing..." : "Proceed to Survey"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 26,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    fontFamily: "outfit",
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontFamily: "outfit",
    minHeight: 50,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    fontFamily: "outfit-bold",
    fontSize: 17,
    color: Colors.WHITE,
    textAlign: "center",
  },
});
