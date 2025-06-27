import React from 'react';
import { StyleSheet, View, Text, Image, ViewStyle } from 'react-native';
import COLORS from '@/constants/colors';
import { UserRole } from '@/types';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  userRole?: UserRole;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  userRole = 'volunteer',
  style,
}) => {
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    switch (userRole) {
      case 'restaurant':
        return COLORS.restaurant.primary;
      case 'ngo':
        return COLORS.ngo.primary;
      case 'volunteer':
        return COLORS.volunteer.primary;
      case 'admin':
        return COLORS.admin.primary;
      default:
        return COLORS.volunteer.primary;
    }
  };

  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return (
        nameParts[0].charAt(0).toUpperCase() + 
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: source ? 'transparent' : getRoleColor(),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize: size * 0.4,
            },
          ]}
        >
          {getInitials()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Avatar;