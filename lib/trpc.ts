import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Development fallbacks
  if (__DEV__) {
    // For Expo development
    if (typeof window !== 'undefined') {
      // Web - use current origin
      return window.location.origin;
    }
    // Mobile - use localhost or your development server IP
    return 'http://localhost:8081';
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers() {
        return {
          'Content-Type': 'application/json',
        };
      },
      fetch(url, options) {
        console.log('tRPC Request:', url, options?.method || 'GET');
        return fetch(url, {
          ...options,
          credentials: 'omit', // Don't send cookies for CORS
        }).then(response => {
          if (!response.ok) {
            console.error('tRPC Response Error:', response.status, response.statusText);
          }
          return response;
        }).catch(error => {
          console.error('tRPC Network Error:', error);
          throw error;
        });
      },
    }),
  ],
});