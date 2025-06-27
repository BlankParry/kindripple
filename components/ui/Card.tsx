import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
  animationDelay?: number;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  animated = true,
  animationDelay = 0
}) => {
  const { theme } = useTheme();
  
  const cardStyles = createStyles(theme);

  if (animated && Platform.OS !== 'web') {
    return (
      <Animated.View 
        entering={FadeInUp.delay(animationDelay).duration(300)}
        style={[cardStyles.card, style]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={[cardStyles.card, style]}>
      {children}
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
});

export default Card;