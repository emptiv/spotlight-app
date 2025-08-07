import { playSound } from '@/constants/playClickSound';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Plumatika!</Text>

      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />

      <TouchableOpacity 
        style={styles.buttonDark} 
        onPress={async () => {
          await playSound('click');
          router.push('/(auth)/sign-up');
        }}
      >
        <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonDark, { marginTop: 13 }]}
        onPress={async () => {
          await playSound('click');
          router.push('/(auth)/sign-in');
        }}
      >
        <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>
          Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 40,
    color: Colors.PRIMARY,
    marginBottom: 30,
    textAlign: 'center',
  },
  logo: {
    width: '70%',
    height: 280,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  buttonLight: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    width: '65%',
    marginBottom: 16,
  },
  buttonDark: {
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    width: '65%',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'outfit',
  },
});
