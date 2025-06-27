import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import COLORS from '@/constants/colors';
import { UserRole } from '@/types';

interface BadgeProps {
  label: string;
  variant?: 'filled' | 'outline';
  userRole?: UserRole;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'filled',
  userRole = 'volunteer',
  size = 'small',
  style,
  textStyle,
}) => {
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    switch (userRole) {
      case 'restaurant':
        return variant === 'filled' ? COLORS.restaurant.primary : COLORS.restaurant.light;
      case 'ngo':
        return variant === 'filled' ? COLORS.ngo.primary : COLORS.ngo.light;
      case 'volunteer':
        return variant === 'filled' ? COLORS.volunteer.primary : COLORS.volunteer.light;
      case 'admin':
        return variant === 'filled' ? COLORS.admin.primary : COLORS.admin.light;
      default:
        return variant === 'filled' ? COLORS.volunteer.primary : COLORS.volunteer.light;
    }
  };

  // Get badge styles based on variant and size
  const getBadgeStyles = (): ViewStyle => {
    let badgeStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'filled':
        badgeStyle = {
          backgroundColor: getRoleColor(),
          borderWidth: 0,
        };
        break;
      case 'outline':
        badgeStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: getRoleColor(),
        };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        badgeStyle = {
          ...badgeStyle,
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 4,
        };
        break;
      case 'medium':
        badgeStyle = {
          ...badgeStyle,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
        };
        break;
      case 'large':
        badgeStyle = {
          ...badgeStyle,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
        break;
    }
    
    return badgeStyle;
  };

  // Get text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    let textStyleObj: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };
    
    // Variant-specific text styles
    switch (variant) {
      case 'filled':
        textStyleObj = {
          ...textStyleObj,
          color: '#FFFFFF',
        };
        break;
      case 'outline':
        textStyleObj = {
          ...textStyleObj,
          color: getRoleColor(),
        };
        break;
    }
    
    // Size-specific text styles
    switch (size) {
      case 'small':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 12,
        };
        break;
      case 'medium':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 14,
        };
        break;
      case 'large':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 16,
        };
        break;
    }
    
    return textStyleObj;
  };

  return (
    <View style={[styles.badge, getBadgeStyles(), style]}>
      <Text style={[getTextStyles(), textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});

export default Badge;