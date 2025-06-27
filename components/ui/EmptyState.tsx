import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import COLORS from '@/constants/colors';
import Button from './Button';
import { UserRole } from '@/types';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonPress?: () => void;
  userRole?: UserRole;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  buttonText,
  onButtonPress,
  userRole = 'volunteer',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {buttonText && onButtonPress && (
        <Button
          title={buttonText}
          onPress={onButtonPress}
          userRole={userRole}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 150,
  },
});

export default EmptyState;