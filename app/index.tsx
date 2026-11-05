import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, FontWeight, Typography } from '../constants';
import { useAuth } from '../store/authStore';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => router.replace(user ? '/(tabs)/home' : '/(auth)/login'), 1450);
    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.pattern} />
      <Animated.View style={[styles.lockup, { opacity, transform: [{ scale }] }]}>
        <View style={styles.mark}>
          <View style={[styles.wing, styles.leftWing]} />
          <View style={[styles.wing, styles.rightWing]} />
          <View style={styles.body}><View /><View /></View>
        </View>
        <Text style={styles.name}>Ivybee</Text>
        <Text style={styles.byline}>BY IVY BRILLIANCE</Text>
        <Text style={styles.promise}>Your child&apos;s school day, closer to home.</Text>
      </Animated.View>
      <View style={styles.progress}><Animated.View style={[styles.progressFill, { opacity }]} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: Colors.primary },
  pattern: { position: 'absolute', width: 380, height: 380, borderRadius: 190, borderWidth: 1, borderColor: 'rgba(23,23,19,.18)', transform: [{ scaleX: 1.6 }] },
  lockup: { alignItems: 'center' },
  mark: { width: 74, height: 66, marginBottom: 18 },
  wing: { position: 'absolute', top: 2, width: 35, height: 30, borderWidth: 2, borderColor: Colors.ink, backgroundColor: 'rgba(255,255,255,.28)' },
  leftWing: { left: 2, borderTopLeftRadius: 26, borderBottomRightRadius: 20, transform: [{ rotate: '-20deg' }] },
  rightWing: { right: 2, borderTopRightRadius: 26, borderBottomLeftRadius: 20, transform: [{ rotate: '20deg' }] },
  body: { position: 'absolute', left: 23, top: 20, width: 30, height: 43, overflow: 'hidden', borderRadius: 16, backgroundColor: Colors.ink, borderWidth: 2, borderColor: Colors.ink },
  name: { color: Colors.ink, fontFamily: Typography.display, fontSize: 44, fontWeight: FontWeight.extrabold, letterSpacing: -2 },
  byline: { marginTop: 5, color: '#6F5200', fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 2.7 },
  promise: { width: 280, marginTop: 24, color: Colors.inkSoft, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  progress: { position: 'absolute', bottom: 48, width: 120, height: 3, overflow: 'hidden', borderRadius: 3, backgroundColor: 'rgba(23,23,19,.18)' },
  progressFill: { width: '100%', height: '100%', backgroundColor: Colors.ink },
});
