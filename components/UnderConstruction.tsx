import { COLORS } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function UnderConstruction() {
  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={60} color={COLORS.primary} />
      <Text style={styles.text}>Under Construction</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
