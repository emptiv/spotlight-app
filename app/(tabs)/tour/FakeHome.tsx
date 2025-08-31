// tourScreens/TourHome.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../../constants/Colors";

export default function TourHome() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      {/* Fake Header */}
      <View style={styles.fakeHeader}>
        <Ionicons name="menu" size={28} color={Colors.BLACK} />
        <Text style={styles.fakeHeaderTitle}>Home</Text>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="help-circle"
            size={30}
            color={Colors.BLACK}
            style={{ marginRight: 12 }}
          />
          <Ionicons name="chatbox-ellipses" size={26} color={Colors.BLACK} paddingTop={2.5} />
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.subtitle}>How do you want to start your day?</Text>

        {/* Card 1 */}
        <TouchableOpacity style={[styles.card, styles.card1]} activeOpacity={1}>
          <View style={styles.card1Group}>
            <Text style={styles.cardText} numberOfLines={2} adjustsFontSizeToFit>
              Ready to learn?
            </Text>
            <View style={styles.card1Button}>
              <Text style={styles.buttonText}>Go to Lessons</Text>
            </View>
          </View>
          <Image
            source={require("../../../assets/images/home1.png")}
            style={styles.card1Image}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Card 2 */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.topLabel}>Practice your scribbles</Text>
          <TouchableOpacity style={[styles.card, styles.card2]} activeOpacity={1}>
            <Image
              source={require("../../../assets/images/home2.png")}
              style={styles.card2Image}
              resizeMode="contain"
            />
            <View style={styles.card2Group}>
              <Text
                style={styles.cardText}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                Refresh your mind!
              </Text>
              <View style={styles.card2Button}>
                <Text style={styles.buttonText}>Go to Practice</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card 3 */}
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.topLabel}>Play and learn</Text>
          <TouchableOpacity style={[styles.card, styles.card3]} activeOpacity={1}>
            <View style={styles.card3Group}>
              <Text
                style={styles.cardText}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                Make learning fun!
              </Text>
              <View style={styles.card3Button}>
                <Text style={styles.buttonText}>Go to Mini Games</Text>
              </View>
            </View>
            <Image
              source={require("../../../assets/images/home3.png")}
              style={styles.card3Image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fakeHeader: {
    height: 85,
    paddingTop: 25,
    backgroundColor: Colors.SECONDARY,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fakeHeaderTitle: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    color: Colors.BLACK,
    paddingRight: 150,
  },
  container: {
    padding: 24,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
    height: 140,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardText: {
    fontSize: 15,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 4,
    textAlign: "center",
    maxWidth: 160,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: "outfit-bold",
    color: Colors.WHITE,
  },
  card1: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 140,
    paddingBottom: 24,
    position: "relative",
  },
  card1Group: {
    marginLeft: -17,
    marginTop: -15,
    width: 160,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
    bottom: -40,
    right: -25,
  },
  card2: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 140,
    paddingBottom: 24,
    position: "relative",
  },
  card2Image: {
    width: 200,
    height: 200,
    position: "absolute",
    left: -40,
    top: -35,
  },
  card2Group: {
    marginTop: 68,
    marginLeft: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  card2Button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 3,
    paddingHorizontal: 17,
    borderRadius: 17,
    marginTop: 1,
  },
  card3: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 140,
    paddingBottom: 24,
    position: "relative",
  },
  card3Group: {
    marginTop: 41,
    marginLeft: -10,
    width: 160,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
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
    position: "absolute",
    bottom: 23,
    right: -25,
  },
  topLabel: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 9,
    marginLeft: 1,
    textAlign: "left",
  },
});
