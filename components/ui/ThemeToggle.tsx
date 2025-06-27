import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 24, 
  style 
}) => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Add press animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Cycle through: system -> light -> dark -> system
    switch (themeMode) {
      case 'system':
        setThemeMode('light');
        break;
      case 'light':
        setThemeMode('dark');
        break;
      case 'dark':
        setThemeMode('system');
        break;
    }
  };

  const getIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={size} color={theme.text.primary} strokeWidth={2} />;
      case 'dark':
        return <Moon size={size} color={theme.text.primary} strokeWidth={2} />;
      case 'system':
        return <Monitor size={size} color={theme.text.primary} strokeWidth={2} />;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.container, 
          { 
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }, 
          style
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {getIcon()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ThemeToggle;