import { playSound } from '@/constants/playClickSound';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';


export default function landing() {

  const router = useRouter()
  
  return (
    <View style={{ 
        flex: 1, 
        backgroundColor: Colors.WHITE, 
        alignItems: 'center' }}>
      <Image
        source={require('../../assets/images/landing-2.png')}
        style={{ width: '80%', height: 320, marginTop: 70, marginBottom: 50}}/>

      <View style={{ 
        padding: 25, 
        backgroundColor: Colors.PRIMARY, 
        height: '100%', 
        width: '100%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,}}>

        
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 30,
          textAlign: 'center',
          color: Colors.WHITE,
        }}>Welcome to Plumatika</Text>

        <Text style={{
          fontFamily: 'outfit',
          fontSize: 20,
          textAlign: 'center',
          color: Colors.WHITE,
          marginTop: 20,
          marginBottom: 20
        }}>
          Write the past, shape the future. Scribble your way to ace Baybayin!</Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={async () => {
            await playSound('click');
            router.push('/(auth)/sign-up');
          }}
        >
          <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>
          Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
          {
          backgroundColor: Colors.PRIMARY,
          borderWidth: 1,
          borderColor: Colors.WHITE,
          },
          ]}
          onPress={async () => {
            await playSound('click');
            router.push('/(auth)/sign-in');
          }}
        >
  
  <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
    Already have an Account?
  </Text>
</TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button:{
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'outfit'
  }
})