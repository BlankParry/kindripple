import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { X, Send, Bot } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';
import MessageBubble from './MessageBubble';

interface ChatBotProps {
  visible: boolean;
  onClose: () => void;
  currentScreen?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({
  visible,
  onClose,
  currentScreen = 'unknown',
}) => {
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const {
    messages,
    isLoading,
    sendMessage,
    setContext,
    clearChat,
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Set context when component mounts or user changes
  useEffect(() => {
    if (user) {
      setContext({
        userRole: user.role,
        currentScreen,
        userName: user.name,
      });
    }
  }, [user, currentScreen, setContext]);

  // Animate modal appearance
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText('');
    
    await sendMessage(messageText);
  };

  const handleClose = () => {
    setInputText('');
    onClose();
  };

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

  const animatedStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0],
        }),
      },
    ],
    opacity: slideAnim,
  };

  const styles = createStyles(theme, getRoleColor());

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.botIcon}>
                <Bot size={20} color={theme.text.inverse} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Ripple Assistant</Text>
                <Text style={styles.headerSubtitle}>
                  {isLoading ? 'Typing...' : 'Here to help!'}
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearChat}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <X size={24} color={theme.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View style={styles.welcomeContainer}>
                <View style={styles.welcomeIcon}>
                  <Bot size={32} color={getRoleColor()} />
                </View>
                <Text style={styles.welcomeTitle}>
                  Hi {user?.name?.split(' ')[0] || 'there'}! 👋
                </Text>
                <Text style={styles.welcomeMessage}>
                  I'm Ripple, your KindRipple assistant. I can help you with questions about food donations, deliveries, and using the app.
                </Text>
                <Text style={styles.welcomePrompt}>
                  What would you like to know?
                </Text>
              </View>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  userRole={user?.role || 'volunteer'}
                />
              ))
            )}
            
            {isLoading && (
              <MessageBubble
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: '...',
                  timestamp: Date.now(),
                }}
                userRole={user?.role || 'volunteer'}
                isLoading
              />
            )}
          </ScrollView>

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                placeholderTextColor={theme.text.secondary}
                multiline
                maxLength={500}
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
              
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? getRoleColor() : theme.text.light }
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.7}
              >
                <Send 
                  size={20} 
                  color={inputText.trim() ? theme.text.inverse : theme.text.secondary} 
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any, roleColor: string) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: roleColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.text.secondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: theme.background,
  },
  clearButtonText: {
    fontSize: 14,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: roleColor + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 14,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  welcomePrompt: {
    fontSize: 14,
    color: roleColor,
    fontWeight: '500',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    backgroundColor: theme.surface,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.text.primary,
    backgroundColor: theme.background,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatBot;