// ─────────────────────────────────────────────────────────────────────────────
//  app/index.tsx  — Entry Point / Redirect Gate
//
//  This is the first screen Expo Router loads (it's like "/" in Next.js).
//  We don't show UI here — we just check if the user is logged in and
//  send them to the right place:
//
//    Logged in  →  /home  (main tab screen)
//    Not logged in  →  /login  (auth screen)
//
//  We show a loading spinner while we wait for SecureStore to restore the token
// ─────────────────────────────────────────────────────────────────────────────

import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants';
import { useAuth } from '../store/authStore';

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Still restoring from storage, wait

    if (user) {
      // User is logged in — go to main tabs
      router.replace('/(tabs)/home');
    } else {
      // Not logged in — go to login screen
      router.replace('/(auth)/login');
    }
  }, [user, isLoading]);

  // Show a spinner while deciding where to go
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                        // flex: 1 in RN = "take all available space" (like flex-grow: 1)
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});