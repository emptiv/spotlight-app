import { playSound } from '@/constants/playClickSound';
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
import Colors from '../../constants/Colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hello, Mei!</Text>
      <Text style={styles.subtitle}>How do you want to start your day?</Text>

    {/* Card 1: Manually positioned group on the left, image bottom-right */}
    <View style={[styles.card, styles.card1]}>
      <View style={styles.card1Group}>
        <Text style={styles.cardText}>Continue learning?</Text>
          <TouchableOpacity style={styles.card1Button} onPress={async () => {
            await playSound('click');
            router.push('/lessons');
          }}>
            <Text style={styles.buttonText}>Go to Lessons</Text>
          </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/images/home1.png')}
        style={styles.card1Image}
        resizeMode="contain"
      />
    </View>


{/* Card 2 with external top text */}
<View style={{ marginBottom: 8 }}>
  <Text style={styles.topLabel}>Practice your scribbles</Text>
  <View style={[styles.card, styles.card2]}>
    <Image
      source={require('../../assets/images/home2.png')}
      style={styles.card2Image}
      resizeMode="contain"
    />
    <View style={styles.card2Group}>
      <Text style={styles.cardText}>Refresh your mind!</Text>
        <TouchableOpacity style={styles.card2Button} onPress={async () => {
          await playSound('click');
          router.push('/practice');
        }}>
          <Text style={styles.buttonText}>Go to Practice</Text>
        </TouchableOpacity>
    </View>
  </View>
</View>

{/* Card 3 with external top text */}
<View style={{ marginBottom: 8 }}>
  <Text style={styles.topLabel}>Play and learn</Text>
  <View style={[styles.card, styles.card3]}>
    <View style={styles.card3Group}>
      <Text style={styles.cardText}>Make learning fun!</Text>
        <TouchableOpacity style={styles.card3Button} onPress={async () => {
          await playSound('click');
          router.push('/minigames');
        }}>
          <Text style={styles.buttonText}>Go to Mini Games</Text>
        </TouchableOpacity>

    </View>
    <Image
      source={require('../../assets/images/home3.png')}
      style={styles.card3Image}
      resizeMode="contain"
    />
  </View>
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
    height: 125,
  },
  cardText: {
    fontSize: 15,
    fontFamily: 'outfit-bold',
    color: Colors.PRIMARY,
    marginBottom: 1,
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
  marginTop: 1,
  marginLeft: 7,
  alignItems: 'center', // center text + button within the group
  justifyContent: 'center',
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
  marginTop: 62,
  marginLeft: 168,
  alignItems: 'center', // center text + button within the group
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
  marginTop: 60,
  marginLeft: 7,
  alignItems: 'center', // center text + button within the group
  justifyContent: 'center',
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
},

});
