import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { router } from 'expo-router';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  type: 'food_listing' | 'volunteer_assignment' | 'delivery_update';
  donationId?: string;
  taskId?: string;
  userId?: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: NotificationData;
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return false;
  }

  if (!Device.isDevice) {
    console.log('Must use physical device for notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }

  return true;
}

// Set up notification channels (Android)
export async function setupNotificationChannels() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('food_listings', {
      name: 'Food Listings',
      description: 'Notifications about new food donations',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ee9a40',
    });

    await Notifications.setNotificationChannelAsync('volunteer_assignments', {
      name: 'Volunteer Assignments',
      description: 'Notifications about volunteer assignments',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4ade80',
    });

    await Notifications.setNotificationChannelAsync('delivery_updates', {
      name: 'Delivery Updates',
      description: 'Notifications about delivery status changes',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#8c3ccc',
    });
  }
}

// Send local notification
export async function sendLocalNotification(payload: NotificationPayload) {
  if (Platform.OS === 'web') {
    console.log('Local notification (web):', payload.title, payload.body);
    return;
  }

  try {
    const channelId = payload.data?.type === 'food_listing' 
      ? 'food_listings'
      : payload.data?.type === 'volunteer_assignment'
      ? 'volunteer_assignments'
      : 'delivery_updates';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data,
        sound: true,
      },
      trigger: null, // Show immediately
      ...(Platform.OS === 'android' && { 
        identifier: channelId 
      }),
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
}

// Handle notification tap
export function setupNotificationHandlers() {
  // Handle notification tap when app is running
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data as NotificationData;
    handleNotificationTap(data);
  });

  return subscription;
}

// Navigate based on notification data
function handleNotificationTap(data: NotificationData) {
  try {
    switch (data.type) {
      case 'food_listing':
        if (data.donationId) {
          router.push(`/(app)/donation/${data.donationId}`);
        } else {
          router.push('/(app)/(tabs)/');
        }
        break;
      case 'volunteer_assignment':
        if (data.taskId) {
          router.push(`/(app)/task/${data.taskId}`);
        } else {
          router.push('/(app)/(tabs)/tasks');
        }
        break;
      case 'delivery_update':
        if (data.donationId) {
          router.push(`/(app)/donation/${data.donationId}`);
        } else if (data.taskId) {
          router.push(`/(app)/task/${data.taskId}`);
        } else {
          router.push('/(app)/(tabs)/tasks');
        }
        break;
      default:
        router.push('/(app)/(tabs)/');
    }
  } catch (error) {
    console.error('Error handling notification tap:', error);
  }
}

// Notification helpers for different events
export const NotificationHelpers = {
  // Notify NGOs about new food listing
  async notifyNGOsAboutFoodListing(restaurantName: string, quantity: number, donationId: string) {
    await sendLocalNotification({
      title: "New Food Listing! 🍽️",
      body: `${restaurantName} listed ${quantity} meals available for pickup`,
      data: {
        type: 'food_listing',
        donationId,
      },
    });
  },

  // Notify about volunteer assignment
  async notifyVolunteerAssignment(volunteerName: string, restaurantName: string, taskId: string, isForNGO: boolean) {
    if (isForNGO) {
      await sendLocalNotification({
        title: "Volunteer Assigned! 👥",
        body: `${volunteerName} accepted your delivery request`,
        data: {
          type: 'volunteer_assignment',
          taskId,
        },
      });
    } else {
      await sendLocalNotification({
        title: "New Assignment! 🚚",
        body: `You've been assigned to pickup from ${restaurantName}`,
        data: {
          type: 'volunteer_assignment',
          taskId,
        },
      });
    }
  },

  // Notify about delivery status changes
  async notifyDeliveryStatusChange(status: string, donationId: string, isForRestaurant: boolean) {
    const statusMessages = {
      collected: isForRestaurant ? "Your donation has been collected! 📦" : "Food collected successfully! 📦",
      delivered: isForRestaurant ? "Your donation has been delivered! ✅" : "Food delivered successfully! ✅",
      completed: "Delivery completed! Thank you for making a difference! 🎉",
    };

    const message = statusMessages[status as keyof typeof statusMessages] || `Delivery status updated: ${status}`;

    await sendLocalNotification({
      title: "Delivery Update",
      body: message,
      data: {
        type: 'delivery_update',
        donationId,
      },
    });
  },
};