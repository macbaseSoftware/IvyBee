import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { setAuthToken } from '../services/api';
import { AuthProvider, useAuth } from '../store/authStore';

function RootNavigator() {
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="course/[id]" />
        <Stack.Screen name="lesson/[id]" />
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
