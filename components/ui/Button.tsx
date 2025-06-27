import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Platform
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { UserRole } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  userRole?: UserRole;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  userRole = 'volunteer',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Get the appropriate color based on user role
  const getRoleColor = () => {
    switch (userRole) {
      case 'restaurant':
        return variant === 'primary' ? theme.restaurant.primary : theme.restaurant.secondary;
      case 'ngo':
        return variant === 'primary' ? theme.ngo.primary : theme.ngo.secondary;
      case 'volunteer':
        return variant === 'primary' ? theme.volunteer.primary : theme.volunteer.secondary;
      case 'admin':
        return variant === 'primary' ? theme.admin.primary : theme.admin.secondary;
      default:
        return variant === 'primary' ? theme.primary : theme.secondary;
    }
  };

  // Get button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: getRoleColor(),
          borderWidth: 0,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: getRoleColor(),
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: getRoleColor(),
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
        };
        break;
    }
    
    return buttonStyle;
  };

  // Get text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    let textStyleObj: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };
    
    // Variant-specific text styles
    switch (variant) {
      case 'primary':
        textStyleObj = {
          ...textStyleObj,
          color: theme.text.inverse,
        };
        break;
      case 'secondary':
      case 'outline':
      case 'text':
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
          fontSize: 14,
        };
        break;
      case 'medium':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 16,
        };
        break;
      case 'large':
        textStyleObj = {
          ...textStyleObj,
          fontSize: 18,
        };
        break;
    }
    
    return textStyleObj;
  };

  // Get platform-specific shadow styles
  const getShadowStyles = (): ViewStyle => {
    if (variant === 'text') {
      return {};
    }

    if (Platform.OS === 'ios') {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      };
    } else if (Platform.OS === 'android') {
      return {
        elevation: 3,
      };
    } else {
      // Web - use a simple border instead of shadow to avoid CSS issues
      return {
        borderWidth: variant === 'primary' ? 0 : 1,
        borderColor: variant === 'primary' ? 'transparent' : theme.border,
      };
    }
  };

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      scale.value = withSpring(0.95, { damping: 15 });
      opacity.value = withTiming(0.8, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (Platform.OS !== 'web') {
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === 'web') {
      return {};
    }
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[
        styles.button, 
        getButtonStyles(), 
        getShadowStyles(),
        animatedStyle,
        (disabled || isLoading) && { opacity: 0.6 },
        style
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? theme.text.inverse : getRoleColor()} 
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Button;