import { SignOutButton } from '@/components/SignOutButton'
import React from 'react'
import { Text, View } from 'react-native'

export default function profile() {
  return (
    <View style={{ padding: 16 }}>
      <Text>Profile screen</Text>
      <SignOutButton />
    </View>
  )
}