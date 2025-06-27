import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { trpc, trpcClient } from '@/lib/trpc';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { requestNotificationPermissions, setupNotificationChannels, setupNotificationHandlers } from '@/lib/notifications';
import { useNotificationStore } from '@/store/notification-store';

function RootLayoutContent() {
  const { isDark } = useTheme();
  const { setPermissionGranted } = useNotificationStore();
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  // Setup notifications on app start
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Request permissions
        const granted = await requestNotificationPermissions();
        setPermissionGranted(granted);

        if (granted) {
          // Setup notification channels
          await setupNotificationChannels();
          
          // Setup notification handlers
          const subscription = setupNotificationHandlers();
          
          return () => {
            subscription?.remove();
          };
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, [setPermissionGranted]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="auth/login" 
              options={{ 
                title: "Login",
                headerStyle: { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' },
                headerTintColor: isDark ? '#f9fafb' : '#1f2937',
              }} 
            />
            <Stack.Screen 
              name="auth/register" 
              options={{ 
                title: "Register",
                headerStyle: { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' },
                headerTintColor: isDark ? '#f9fafb' : '#1f2937',
              }} 
            />
          </Stack>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}