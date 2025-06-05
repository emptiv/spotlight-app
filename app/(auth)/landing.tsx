import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Colors from '../../constants/Colors'


export default function landing() {

  const router = useRouter()
  
  return (
    <View style={{ 
        flex: 1, 
        backgroundColor: Colors.WHITE, 
        alignItems: 'center' }}>
      <Image
        source={require('../../assets/images/landing-1.png')}
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
          fontSize: 18,
          textAlign: 'center',
          color: Colors.WHITE,
          marginTop: 20,
          marginBottom: 20
        }}>
          A mobile app that will teach you Baybayin. You will become very good at it. I promise.</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/sign-up')}>
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
          onPress={() => router.push('/(auth)/sign-in')}>
  
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