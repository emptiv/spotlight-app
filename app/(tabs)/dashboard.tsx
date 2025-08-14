
import Colors from "@/constants/Colors";
import { playSound } from '@/constants/playClickSound';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const screenWidth = Dimensions.get("window").width;

// Map badge names to images
const badgeImages: Record<string, any> = {
  challenger: require('@/assets/badges/challenger.png'),
  perfectionist: require('@/assets/badges/perfectionist.png'),
  'su-su-supernova': require('@/assets/badges/supernova.png'),
};

export default function Dashboard() {
  const router = useRouter();
  const { userId: clerkUserId } = useAuth();

  // Profile data
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  );
  const userRecord = useQuery(
    api.users.getUserById,
    convexUserId ? { userId: convexUserId } : "skip"
  );
  const updateName = useMutation(api.users.updateUserName);
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Achievements data
  const achievements = useQuery(
    api.user_achievements.getUserAchievements,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  useEffect(() => {
    if (userRecord?.name) setName(userRecord.name);
  }, [userRecord?.name]);

  const handleSave = async () => {
    try {
      await playSound('click');
      if (!convexUserId) throw new Error('Missing Convex user ID');

      await updateName({ userId: convexUserId, name });

      setFeedbackText('Name updated successfully!');

      setTimeout(() => {
        setFeedbackText('');
        setModalVisible(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setFeedbackText('Update failed.');
      setTimeout(() => setFeedbackText(''), 2000);
    }
  };

  // Dashboard data
  const data = useQuery(
    api.get_dashboard_data.getUserDashboardData,
    clerkUserId ? { userId: clerkUserId } : "skip"
  );

  const earnedBadgeNames = achievements ? Array.from(new Set(achievements.map(a => a.badge.toLowerCase()))) : [];

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  const { user, lessonProgress, totalXP } = data;
  const completedLessons = lessonProgress.filter((l) => l.isCompleted);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Big Title */}
      <Text style={styles.title}>{name || 'Unnamed'}'s Dashboard</Text>
      {/* Profile Summary */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name || 'Unnamed'}</Text>
              <TouchableOpacity
                onPress={async () => {
                  await playSound('click');
                  setModalVisible(true);
                  setName(name || '');
                  setFeedbackText('');
                }}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="pencil" size={20} color={Colors.BLACK} />
              </TouchableOpacity>
            </View>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total XP</Text>
            <Text style={styles.statValue}>{totalXP}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Last Active</Text>
            <Text style={styles.statValue}>
              {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "N/A"}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Achievements</Text>
            <Text style={styles.statValue}>{achievements?.length ?? 0}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={styles.reButton}
          onPress={async () => {
            await playSound('click');
            router.push('/dashb/achievements');
          }}
        >
          <Text style={styles.reButtonText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reButton}
          onPress={async () => {
            await playSound('click');
            router.push('/dashb/statistics');
          }}
        >
          <Text style={styles.reButtonText}>Statistics</Text>
        </TouchableOpacity>
      </View>

      {/* Badges Card */}
      {earnedBadgeNames.length > 0 && (
      <View style={styles.badgesCard}>
        <Text style={styles.cardTitle}>Badges</Text>
        <View style={styles.badgesContainer}>
          {earnedBadgeNames.map((badgeName) => {
            const badgeSrc = badgeImages[badgeName];
            if (!badgeSrc) return null;

            return (
              <View key={badgeName} style={styles.badgeWrapper}>
                <Image
                  source={badgeSrc}
                  style={styles.badgeImage}
                />
                <Text style={styles.badgeLabel}>{badgeName}</Text>
              </View>
            );
          })}
        </View>
      </View>

      )}

      {/* Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>
        <View style={styles.progressTopRow}>
          <Text style={styles.progressTitleText}>
            {completedLessons.length === 7 ? "🏆 Champion!" : "🚀 Keep Going!"}
          </Text>
          <Text style={styles.progressBigNumber}>
            {Math.round((completedLessons.length / 7) * 100)}%
          </Text>
        </View>
        <Text style={styles.progressSubText}>
          {completedLessons.length} of 7 lessons completed
        </Text>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBarFill,
              { width: `${(completedLessons.length / 7) * 100}%` },
            ]}
          />
        </View>
      </View>



      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
              autoFocus
            />
            {feedbackText ? (
              <Text style={styles.feedbackText}>{feedbackText}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setFeedbackText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    paddingLeft: 4,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginTop: 10,
    marginBottom: 16,
  },

  container: {
    padding: 16,
    backgroundColor: Colors.WHITE,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    marginRight: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "#222",
  },
  emailText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
    fontFamily: "outfit",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
    fontFamily: "outfit",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    marginBottom: 5,
    color: Colors.PRIMARY,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressTitleText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  progressBigNumber: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.PRIMARY,
  },
  progressSubText: {
    fontFamily: "outfit",
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  tabSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 13,
  },
  reButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY,
    width: 125,
  },
  reButtonText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.BLACK,
    textAlign: "center",
  },
  signOutButton: {
    marginTop: 20,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 12,
    color: Colors.PRIMARY,
  },
  nameInput: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontFamily: 'outfit',
    color: Colors.BLACK,
  },
  feedbackText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontFamily: 'outfit-bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.BLACK,
    fontFamily: 'outfit-bold',
  },
badgesCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingLeft: 13,
  paddingRight: 13,
  paddingBottom: 5,
  paddingTop: 5,
},

badgesContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',   // center badges in each row
  alignItems: 'center',       // center the rows themselves
  gap: 16,                    // spacing between badges
},

badgeWrapper: {
  alignItems: 'center',       // center image + text
  width: 80,                  // control horizontal width
  height: 100,                // fixed height for consistent alignment
  marginBottom: 16,           // vertical spacing
  justifyContent: 'flex-start', // text appears below image
},

badgeImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: Colors.PRIMARY,
  marginBottom: 4,            // spacing between image and label
},

badgeLabel: {
  fontFamily: 'outfit',
  fontSize: 12,
  color: '#555',
  textAlign: 'center',
  textTransform: 'capitalize', // capitalizes first letter of each word/segment
},

});
