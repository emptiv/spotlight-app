import { playSound } from '@/constants/playClickSound';
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../../components/LanguageContext';
import Colors from '../../constants/Colors';

const SURVEY_ID = "plumatika";

export default function HomeScreen() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { userId: clerkUserId } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  // Get Convex user ID using Clerk ID
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  );

  // Fetch full user record using Convex ID
  const user = useQuery(
    api.users.getUserById,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  // Check if user has submitted survey
  const hasSubmitted = useQuery(api.feedback.hasSubmittedFeedback, {
    userId: clerkUserId || "",
    surveyId: SURVEY_ID,
  });

  // Show modal if user hasn't submitted yet
  useEffect(() => {
    if (hasSubmitted === false) {
      setTimeout(() => setModalVisible(true), 1500); // slight delay for nicer UX
    }
  }, [hasSubmitted]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {lang === 'en' && ( <Text style={styles.title}>Hello{user?.name ? `, ${user.name}!` : '!' }</Text>)}
        {lang === 'fil' && ( <Text style={styles.title}>Mabuhay{user?.name ? `, ${user.name}!` : '!' }</Text>)}

        {lang === 'en' && <Text style={styles.subtitle}>How do you want to start your day?</Text>}
        {lang === 'fil' && <Text style={styles.subtitle}>Paano mo gustong simulan ang araw mo?</Text>}

        {/* Card 1 */}
        <TouchableOpacity
          style={[styles.card, styles.card1]}
          activeOpacity={0.9}
          onPress={async () => {
            await playSound('click');
            router.push('/chapters');
          }}
        >
          <View style={styles.card1Group}>
            <Text style={styles.cardText} numberOfLines={2} adjustsFontSizeToFit>
              {lang === 'en' ? 'Ready to learn?' : 'Handa ka na?'}
            </Text>
            <View style={styles.card1Button}>
              <Text style={styles.buttonText}>Go to Lessons</Text>
            </View>
          </View>
          <Image
            source={require('../../assets/images/home1.png')}
            style={styles.card1Image}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Card 2 */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.topLabel} numberOfLines={2} adjustsFontSizeToFit>
            {lang === 'en' ? 'Practice your scribbles' : 'Sanayin ang iyong pagsusulat'}
          </Text>
          <TouchableOpacity
            style={[styles.card, styles.card2]}
            activeOpacity={0.9}
            onPress={async () => {
              await playSound('click');
              router.push('/practice');
            }}
          >
            <Image
              source={require('../../assets/images/home2.png')}
              style={styles.card2Image}
              resizeMode="contain"
            />
            <View style={styles.card2Group}>
              <Text style={styles.cardText} numberOfLines={2} adjustsFontSizeToFit>
                {lang === 'en' ? 'Refresh your mind!' : 'Patalasin ang isip!'}
              </Text>
              <View style={styles.card2Button}>
                <Text style={styles.buttonText}>Go to Practice</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card 3 */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.topLabel} numberOfLines={2} adjustsFontSizeToFit>
            {lang === 'en' ? 'Play and learn' : 'Maglaro at matuto'}
          </Text>
          <TouchableOpacity
            style={[styles.card, styles.card3]}
            activeOpacity={0.9}
            onPress={async () => {
              await playSound('click');
              router.push('/minigames');
            }}
          >
            <View style={styles.card3Group}>
              <Text style={styles.cardText} numberOfLines={2} adjustsFontSizeToFit>
                {lang === 'en' ? 'Make learning fun!' : 'Tara, matuto tayo!'}
              </Text>
              <View style={styles.card3Button}>
                <Text style={styles.buttonText}>Go to Mini Games</Text>
              </View>
            </View>
            <Image
              source={require('../../assets/images/home3.png')}
              style={styles.card3Image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Enhanced Survey Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../../assets/ming/heart.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalTitle}>A Quick Favor?</Text>
            <Text style={styles.modalText}>
              We'd love to hear your thoughts! Your feedback helps us make learning with Plumatika more fun and effective.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={async () => {
                  setModalVisible(false);
                  router.push({
                    pathname: "/feedback/consent",
                    params: { userId: clerkUserId, surveyId: SURVEY_ID },
                  });
                }}
              >
                <Text style={styles.modalButtonText}>Take Survey</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ---- Existing styles ----
const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: Colors.WHITE },
  title: { fontSize: 32, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 1 },
  subtitle: { fontSize: 16, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 15 },
  card: { backgroundColor: Colors.SECONDARY, borderRadius: 25, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, position: 'relative', height: 140, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 2 },
  cardText: { fontSize: 15, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 4, textAlign: 'center', maxWidth: 160 },
  card1: { justifyContent: 'flex-start', alignItems: 'flex-start', height: 140, paddingBottom: 24, position: 'relative' },
  card1Group: { marginLeft: -17, marginTop: -15, width: 160, height: 80, justifyContent: 'center', alignItems: 'center' },
  card1Button: { backgroundColor: Colors.PRIMARY, paddingVertical: 3, paddingHorizontal: 24, borderRadius: 17, marginTop: 1 },
  card1Image: { width: 200, height: 200, position: 'absolute', bottom: -40, right: -25 },
  card2: { justifyContent: 'flex-start', alignItems: 'flex-start', height: 140, paddingBottom: 24, position: 'relative' },
  card2Image: { width: 200, height: 200, position: 'absolute', left: -40, top: -35 },
  card2Group: { marginTop: 68, marginLeft: 153, alignItems: 'center', justifyContent: 'center' },
  card2Button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 4,
    paddingHorizontal: 20, // more breathing room
    borderRadius: 17,
    marginTop: 1,
    alignSelf: "center",   // prevent stretching
    minWidth: 120,         // ensure enough space on small devices
  },
  card3: { justifyContent: 'flex-start', alignItems: 'flex-start', height: 140, paddingBottom: 24, position: 'relative' },
  card3Group: { marginTop: 41, marginLeft: -10, width: 160, height: 80, justifyContent: 'center', alignItems: 'center' },
  card3Button: { backgroundColor: Colors.PRIMARY, paddingVertical: 3, paddingHorizontal: 19, borderRadius: 17, marginTop: 1 },
  card3Image: { width: 180, height: 180, position: 'absolute', bottom: 23, right: -25 },
  topLabel: { fontSize: 20, fontFamily: 'outfit-bold', color: Colors.PRIMARY, marginBottom: 9, marginLeft: 1, textAlign: 'left' },
  buttonText: { 
    fontSize: 13, 
    fontFamily: 'outfit-bold', 
    color: Colors.WHITE, 
    textAlign: "center" 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  modalButtonText: { fontFamily: "outfit-bold", color: Colors.WHITE, fontSize: 16 },
  modalButtonTextSecondary: { fontFamily: "outfit-bold", color: Colors.BLACK, fontSize: 16 },
});