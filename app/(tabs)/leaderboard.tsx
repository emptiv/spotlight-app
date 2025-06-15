import UnderConstruction from '@/components/UnderConstruction';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function leaderboard() {
  return (
    <View style={styles.container}>
      <UnderConstruction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
