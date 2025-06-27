import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { X, Bell, Package, Truck } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { InAppNotification } from '@/store/notification-store';

interface NotificationToastProps {
  notification: InAppNotification;
  onDismiss: () => void;
  onPress?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onPress,
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Package size={20} color="#4ade80" />;
      case 'info':
        return <Bell size={20} color="#3b82f6" />;
      case 'warning':
        return <Truck size={20} color="#f59e0b" />;
      case 'error':
        return <X size={20} color="#ef4444" />;
      default:
        return <Bell size={20} color={theme.text.secondary} />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return '#4ade8020';
      case 'info':
        return '#3b82f620';
      case 'warning':
        return '#f59e0b20';
      case 'error':
        return '#ef444420';
      default:
        return theme.surface;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return '#4ade80';
      case 'info':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return theme.border;
    }
  };

  const styles = createStyles(theme, getBackgroundColor(), getBorderColor());

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={theme.text.secondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (theme: any, backgroundColor: string, borderColor: string) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: backgroundColor,
    borderLeftWidth: 4,
    borderLeftColor: borderColor,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: theme.text.secondary,
    lineHeight: 16,
  },
  dismissButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default NotificationToast;