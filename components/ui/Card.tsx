import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import COLORS from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  elevation = 2 
}) => {
  return (
    <View 
      style={[
        styles.card, 
        { 
          shadowOpacity: 0.08 * elevation,
          elevation: elevation,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginVertical: 8,
  },
});

export default Card;