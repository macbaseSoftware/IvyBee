import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { setAuthToken } from '../services/api';
import { enablePushNotifications } from '../services/notifications';
import { AuthProvider, useAuth } from '../store/authStore';

function RootNavigator() {
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
    if (token) enablePushNotifications().catch(() => undefined);
  }, [token]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="group/[id]" />
        <Stack.Screen name="games/index" />
        <Stack.Screen name="games/memory" />
        <Stack.Screen name="games/sudoku" />
        <Stack.Screen name="games/math" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
