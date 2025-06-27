import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatContext, askRipple } from '@/lib/gemini';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isVisible: boolean;
  context: ChatContext | null;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setVisible: (visible: boolean) => void;
  setContext: (context: ChatContext) => void;
  getRecentMessages: (count?: number) => ChatMessage[];
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      isVisible: false,
      context: null,

      addMessage: (content, role) => {
        const message: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role,
          content,
          timestamp: Date.now(),
        };

        set(state => ({
          messages: [...state.messages, message]
        }));
      },

      sendMessage: async (content) => {
        const { addMessage, context } = get();
        
        // Add user message
        addMessage(content, 'user');
        
        // Set loading state
        set({ isLoading: true });

        try {
          // Get AI response
          const response = await askRipple(content, context || {
            userRole: 'volunteer',
            currentScreen: 'chat',
          });

          // Add assistant response
          addMessage(response, 'assistant');
        } catch (error) {
          console.error('Error getting AI response:', error);
          addMessage(
            "I'm sorry, I'm having trouble responding right now. Please try again later or contact support if the issue persists.",
            'assistant'
          );
        } finally {
          set({ isLoading: false });
        }
      },

      clearChat: () => {
        set({ messages: [] });
      },

      setVisible: (visible) => {
        set({ isVisible: visible });
      },

      setContext: (context) => {
        set({ context });
      },

      getRecentMessages: (count = 10) => {
        const { messages } = get();
        return messages.slice(-count);
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep only last 50 messages
      }),
    }
  )
);