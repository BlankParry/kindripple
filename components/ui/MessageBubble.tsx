import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Bot, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChatMessage } from '@/lib/gemini';
import { UserRole } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  userRole: UserRole;
  isLoading?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  userRole,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Get role-specific color
  const getRoleColor = () => {
    switch (userRole) {
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

  // Animate message appearance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const isUser = message.role === 'user';
  const roleColor = getRoleColor();

  const styles = createStyles(theme, roleColor, isUser);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.messageRow}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Bot size={16} color={theme.text.inverse} />
            </View>
          </View>
        )}
        
        <View style={styles.bubble}>
          <Text style={styles.messageText}>
            {isLoading ? (
              <LoadingDots />
            ) : (
              message.content
            )}
          </Text>
          
          {!isLoading && (
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: roleColor }]}>
              <User size={16} color={theme.text.inverse} />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Loading dots animation component
const LoadingDots: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      const duration = 600;
      const delay = 200;

      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1, {
            toValue: 1,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 1,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 1,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(dot1, {
            toValue: 0,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(dot2, {
            toValue: 0,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(dot3, {
            toValue: 0,
            duration: duration / 3,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDots();
  }, [dot1, dot2, dot3]);

  return (
    <View style={loadingStyles.container}>
      <Animated.Text style={[loadingStyles.dot, { opacity: dot1 }]}>•</Animated.Text>
      <Animated.Text style={[loadingStyles.dot, { opacity: dot2 }]}>•</Animated.Text>
      <Animated.Text style={[loadingStyles.dot, { opacity: dot3 }]}>•</Animated.Text>
    </View>
  );
};

const loadingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    fontSize: 20,
    marginHorizontal: 2,
  },
});

const createStyles = (theme: any, roleColor: string, isUser: boolean) => StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isUser ? roleColor : '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    maxWidth: '70%',
    backgroundColor: isUser ? roleColor : theme.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: isUser ? 16 : 4,
    borderBottomRightRadius: isUser ? 4 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: isUser ? theme.text.inverse : theme.text.primary,
  },
  timestamp: {
    fontSize: 11,
    color: isUser ? theme.text.inverse + '80' : theme.text.secondary,
    marginTop: 4,
    textAlign: isUser ? 'right' : 'left',
  },
});

export default MessageBubble;