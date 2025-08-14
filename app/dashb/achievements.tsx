import { useAuth } from '@clerk/clerk-expo';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from 'convex/react';
import { useRouter } from "expo-router";
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '@/constants/Colors';
import { playSound } from '@/constants/playClickSound';
import { api } from '@/convex/_generated/api';

const screenWidth = Dimensions.get('window').width;

const lessonMap: Record<string, string> = {
  jx72aewjef2n2jzw5ajht6b32s7jb6bm: 'Lesson 1',
  jx73gf6kgan5zd49zfjza2hyss7jamra: 'Lesson 2',
  jx7fgkbfxajnghpcgf9ebjhjdd7jb9s1: 'Lesson 3',
  jx75w094cp3g52bw137thd7fy57jbrn3: 'Lesson 4',
  jx7aznjdjmag8g7v2v7w7mavtn7jbf9p: 'Lesson 5',
  jx755h0x70cmbc38y6h4wjzss97jaae7: 'Lesson 6',
  jx71t9nq18esz01frqwe6af9xn7md24g: 'Lesson 7',
  typing: 'Spelling Challenge',
};

// Map badge names to images
const badgeImages: Record<string, any> = {
  challenger: require('@/assets/badges/challenger.png'),
  perfectionist: require('@/assets/badges/perfectionist.png'),
  'su-su-supernova': require('@/assets/badges/supernova.png'),
};

export default function Dashboard() {
  const { userId: clerkUserId } = useAuth();
  const router = useRouter();

  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : 'skip'
  );
  const userRecord = useQuery(
    api.users.getUserById,
    convexUserId ? { userId: convexUserId } : 'skip'
  );

  const achievements = useQuery(
    api.user_achievements.getUserAchievements,
    convexUserId ? { userId: convexUserId } : 'skip'
  );
  const data = useQuery(
    api.get_dashboard_data.getUserDashboardData,
    clerkUserId ? { userId: clerkUserId } : 'skip'
  );

  if (!data || !userRecord) {
    return (
      <View style={styles.center}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  const { user, lessonProgress, characterStats, typeStats } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.cardTitle}>Achievements</Text>
        {achievements && achievements.length > 0 ? (
          Object.entries(
            achievements.reduce((acc, achievement) => {
              const lessonName =
                achievement.lessonId && lessonMap[achievement.lessonId]
                  ? lessonMap[achievement.lessonId]
                  : 'General';
              if (!acc[lessonName]) acc[lessonName] = [];
              acc[lessonName].push(achievement);
              return acc;
            }, {} as Record<string, typeof achievements>)
          ).map(([lessonName, lessonAchievements]) => (
            <View key={lessonName} style={{ marginBottom: 16 }}>
              <Text style={styles.lessonHeader}>{lessonName}</Text>
              {lessonAchievements.map((a, i) => (
                <View key={i} style={styles.achievementItem}>
                  {badgeImages[a.badge.toLowerCase()] && (
                    <Image
                      source={badgeImages[a.badge.toLowerCase()]}
                      style={styles.achievementBadgeImage}
                    />
                  )}
                  <View style={styles.achievementText}>
                    {/* Display badge name */}
                    <Text style={styles.badgeName}>{a.badge}</Text>
                    {a.description && (
                      <Text style={styles.achievementDescription}>
                        {a.description}
                      </Text>
                    )}
                    <Text style={styles.achievementDate}>
                      {new Date(a.earnedAt).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={{ fontFamily: 'outfit', color: '#666' }}>
            No achievements yet.
          </Text>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingTop: 70,
    padding: 24, 
    backgroundColor: Colors.WHITE },

  center: { flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' },

  cardTitle: { 
    fontSize: 32,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 1,
  },

  // Achievements
  lessonHeader: { 
    fontSize: 18, 
    fontFamily: 'outfit-bold', 
    color: Colors.BLACK, 
    marginTop: 10, 
    marginBottom: 4 },

  achievementItem: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementBadgeImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // makes it circular
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  achievementText: {
    flex: 1,
  },
  achievementDescription: { fontFamily: 'outfit', fontSize: 14, color: '#444' },
  achievementDate: { fontFamily: 'outfit', fontSize: 12, color: '#888', marginTop: 4 },
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
badgeName: {
  fontFamily: 'outfit-bold',
  fontSize: 14,
  color: Colors.PRIMARY,
  marginBottom: 4,
  textTransform: 'capitalize', // capitalizes first letter of each word/segment
},
});
