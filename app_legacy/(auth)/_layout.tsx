// app/(auth)/_layout.tsx
// The (auth) group layout. The parentheses in the folder name mean
// this is a "route group" — it won't appear in the URL.
// So (auth)/login.tsx → /login  (not /auth/login)

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}