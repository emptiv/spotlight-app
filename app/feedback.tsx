import Colors from '@/constants/Colors';
import { playSound } from '@/constants/playClickSound';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Feedback() {
  const router = useRouter();
  const surveyUrl = 'https://forms.gle/your-google-form-id'; // Replace with your Google Form link

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={async () => {
          await playSound('click');
          router.back();
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.title}>We Value Your Feedback</Text>

      {/* Friendly intro */}
      <Text style={styles.description}>
        We hope you enjoyed your time here and learned something new along the way!{"\n\n"}
        Your feedback means a lot to us—it helps us improve and make your learning experience even better.
      </Text>

      {/* Call to action */}
      <Text style={styles.subText}>
        Please take a moment to fill out our quick survey.
      </Text>

      {/* Survey button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await playSound('click');
          Linking.openURL(surveyUrl);
        }}
      >
        <Text style={styles.buttonText}>Take the Survey</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 70,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
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
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  subText: {
    fontSize: 15,
    fontFamily: 'outfit',
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontFamily: 'outfit-bold',
    fontSize: 16,
    color: Colors.WHITE,
  },
});
