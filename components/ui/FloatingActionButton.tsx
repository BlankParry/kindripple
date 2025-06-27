import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { MessageCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/auth-store';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface FloatingActionButtonProps {
  onPress: () => void;
  hasUnreadMessages?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  hasUnreadMessages = false,
}) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(0);

  // Get role-specific color
  const getRoleColor = () => {
    switch (user?.role) {
      case 'restaurant':
        return theme.restaurant.primary;
      case 'ngo':
        return theme.ngo.primary;
      case 'volunteer':
        return theme.volunteer.primary;
      case 'admin':
        return theme.admin.primary;
      default:
        return theme.primary;
    }
  };

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      scale.value = withSpring(0.9, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (Platform.OS !== 'web') {
      scale.value = withSpring(1, { damping: 15 });
      // Ripple effect
      rippleScale.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 0 })
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'web') {
      return {};
    }
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'web') {
      return { opacity: 0 };
    }
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleScale.value > 0 ? 0.3 : 0,
    };
  });

  const styles = createStyles(theme, getRoleColor());

  return (
    <AnimatedTouchableOpacity
      style={[styles.fab, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      {/* Ripple effect */}
      <Animated.View style={[styles.ripple, rippleStyle]} />
      
      {/* Main button */}
      <MessageCircle size={24} color={theme.text.inverse} />
      
      {/* Unread indicator */}
      {hasUnreadMessages && <Animated.View style={styles.unreadIndicator} />}
    </AnimatedTouchableOpacity>
  );
};

const createStyles = (theme: any, roleColor: string) => StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: roleColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  ripple: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: roleColor,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    borderWidth: 2,
    borderColor: theme.text.inverse,
  },
});

export default FloatingActionButton;