import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import DonationForm from '@/components/ui/DonationForm';
import COLORS from '@/constants/colors';

export default function CreateDonationScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Create Donation',
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text.primary,
        }} 
      />
      <DonationForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});