import { playSound } from '@/constants/playClickSound';
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../../components/LanguageContext';
import Colors from '../../constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const { lang } = useLanguage();

  const { userId: clerkUserId } = useAuth()

  // Get Convex user ID using Clerk ID
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  )

  // Fetch full user record using Convex ID
  const user = useQuery(
    api.users.getUserById,
    convexUserId ? { userId: convexUserId } : "skip"
  )

  return (
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
        <Text
          style={styles.cardText}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {lang === 'en' ? 'Ready to learn?' : 'Handa ka na?'}
        </Text>

        {/* Optional: Keep the small button for looks only */}
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
      <Text
        style={styles.topLabel}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
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
          <Text
            style={styles.cardText}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
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
      <Text
        style={styles.topLabel}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
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
          <Text
            style={styles.cardText}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 32,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    height: 140,
  },
cardText: {
  fontSize: 15,
  fontFamily: 'outfit-bold',
  color: Colors.PRIMARY,
  marginBottom: 4,
  textAlign: 'center',
  maxWidth: 160,
},
  cardButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'outfit-bold',
    color: Colors.WHITE,
  },
  cardImage: {
    width: 60,
    height: 60,
    marginLeft: 12,
  },
  cardImageSmall: {
    width: 50,
    height: 50,
  },
  bottomRightImage: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  card1: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 140,
    paddingBottom: 24,
    position: 'relative',
  },
card1Group: {
  marginLeft: -17,
  marginTop: -15,
  width: 160,
  height: 80, // prevent it from growing when text is longer
  justifyContent: 'center',
  alignItems: 'center',
},
  card1Button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 3,
    paddingHorizontal: 24,
    borderRadius: 17,
    marginTop: 1,
  },
  card1Image: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: -40,
    right: -25,
  },
  card2: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 140,
    paddingBottom: 24,
    position: 'relative',
  },
  card2Image: {
    width: 200,
    height: 200,
    position: 'absolute',
    left: -40,
    top: -35,
  },
  card2Group: {
    marginTop: 68,
    marginLeft: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card2Button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 3,
    paddingHorizontal: 24,
    borderRadius: 17,
    marginTop: 1,
  },
  card3: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 140,
    paddingBottom: 24,
    position: 'relative',
  },

card3Group: {
  marginTop: 41,
  marginLeft: -10,
  width: 160,
  height: 80,
  justifyContent: 'center',
  alignItems: 'center',
},
  card3Button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 3,
    paddingHorizontal: 19,
    borderRadius: 17,
    marginTop: 1,
  },
  card3Image: {
    width: 180,
    height: 180,
    position: 'absolute',
    bottom: 23,
    right: -25,
  },
  topLabel: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 9,
    marginLeft: 1,
    textAlign: 'left',
  },
});
