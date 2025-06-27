import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function RootLayout() {
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

  const [trpcClient] = useState(() => trpc.createClient({
    links: [
      trpc.httpLink({
        url: getBaseUrl() + '/api/trpc',
        transformer: trpc.transformer,
        headers() {
          return {
            'Content-Type': 'application/json',
          };
        },
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'omit', // Don't send cookies for CORS
          });
        },
      }),
    ],
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ title: "Login" }} />
          <Stack.Screen name="auth/register" options={{ title: "Register" }} />
        </Stack>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function getBaseUrl() {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Development fallbacks
  if (__DEV__) {
    // For Expo development
    if (typeof window !== 'undefined') {
      // Web
      return window.location.origin;
    }
    // Mobile - use your local IP or localhost
    return 'http://localhost:8081';
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
}