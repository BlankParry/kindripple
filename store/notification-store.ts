import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  foodListings: boolean;
  volunteerAssignments: boolean;
  deliveryUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  data?: any;
}

interface NotificationState {
  settings: NotificationSettings;
  inAppNotifications: InAppNotification[];
  permissionGranted: boolean;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  addInAppNotification: (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
  setPermissionGranted: (granted: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      settings: {
        foodListings: true,
        volunteerAssignments: true,
        deliveryUpdates: true,
        soundEnabled: true,
        vibrationEnabled: true,
      },
      inAppNotifications: [],
      permissionGranted: false,

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      addInAppNotification: (notification) => {
        const newNotification: InAppNotification = {
          ...notification,
          id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          read: false,
        };

        set(state => ({
          inAppNotifications: [newNotification, ...state.inAppNotifications].slice(0, 50) // Keep only last 50
        }));
      },

      markNotificationAsRead: (id) => {
        set(state => ({
          inAppNotifications: state.inAppNotifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        }));
      },

      clearNotification: (id) => {
        set(state => ({
          inAppNotifications: state.inAppNotifications.filter(notification => notification.id !== id)
        }));
      },

      clearAllNotifications: () => {
        set({ inAppNotifications: [] });
      },

      getUnreadCount: () => {
        return get().inAppNotifications.filter(notification => !notification.read).length;
      },

      setPermissionGranted: (granted) => {
        set({ permissionGranted: granted });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        permissionGranted: state.permissionGranted,
      }),
    }
  )
);