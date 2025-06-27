import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="donation/[id]" options={{ title: "Donation Details" }} />
        <Stack.Screen name="task/[id]" options={{ title: "Task Details" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </ErrorBoundary>
  );
}