import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius, Typography } from '../../constants';
import { api, setAuthToken, SignedInUser } from '../../services/api';
import { useAuth } from '../../store/authStore';

export default function ParentLoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enter = async (token: string, user: SignedInUser) => {
    setAuthToken(token);
    await login(token, user);
    router.replace('/(tabs)/home');
  };

  const signIn = async () => {
    if (!email.trim() || !password) {
      const message = 'Enter the email address and password supplied by your school.';
      setError(message);
      if (Platform.OS !== 'web') Alert.alert('Enter your details', message);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.login(email.trim().toLowerCase(), password);
      await enter(response.accessToken, response.user);
    } catch (error: any) {
      const message = error.message ?? 'Check your details and try again.';
      setError(message);
      if (Platform.OS !== 'web') Alert.alert('Could not sign in', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}><View style={styles.brandMark}><Ionicons name="sparkles" size={20} color={Colors.ink} /></View><View><Text style={styles.brandName}>Ivybee</Text><Text style={styles.brandByline}>IVY BRILLIANCE</Text></View></View>
          <View style={styles.intro}>
            <Text style={styles.kicker}>FAMILY ACCESS</Text>
            <Text style={styles.title}>Stay close to their school day.</Text>
            <Text style={styles.subtitle}>See your children, class groups, teacher updates, photos and important notices in one calm space.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Family sign in</Text>
            <Text style={styles.cardSubtitle}>Use the details provided by your school.</Text>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrap}><Ionicons name="mail-outline" size={19} color={Colors.textMuted} /><TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="parent@example.com" placeholderTextColor={Colors.textMuted} /></View>
            <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
            <View style={styles.inputWrap}><Ionicons name="lock-closed-outline" size={19} color={Colors.textMuted} /><TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" placeholderTextColor={Colors.textMuted} onSubmitEditing={signIn} /></View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.primary} onPress={signIn} disabled={loading}>{loading ? <ActivityIndicator color={Colors.ink} /> : <><Text>Sign in</Text><Ionicons name="arrow-forward" size={19} color={Colors.ink} /></>}</TouchableOpacity>
            <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>OR</Text><View style={styles.dividerLine} /></View>
            <TouchableOpacity style={styles.guest} onPress={() => router.push('/games')}>
              <Ionicons name="game-controller-outline" size={20} color={Colors.ink} />
              <View><Text style={styles.guestTitle}>Continue without signing in</Text><Text style={styles.guestCopy}>Play offline learning games as a guest</Text></View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.help}>Need access? Contact your school administrator.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: Colors.background },
  page: { flexGrow: 1, width: '100%', maxWidth: 500, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 }, brandMark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: Colors.primary },
  brandName: { color: Colors.ink, fontFamily: Typography.display, fontSize: 23, fontWeight: FontWeight.extrabold, letterSpacing: -.8 }, brandByline: { color: Colors.goldDark, fontSize: 7, fontWeight: FontWeight.extrabold, letterSpacing: 1.7 },
  intro: { paddingVertical: 36 }, kicker: { color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.5 },
  title: { marginTop: 9, color: Colors.ink, fontFamily: Typography.display, fontSize: 39, lineHeight: 42, fontWeight: FontWeight.extrabold, letterSpacing: -1.6 },
  subtitle: { marginTop: 13, maxWidth: 390, color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  card: { padding: 21, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, backgroundColor: Colors.paper },
  cardTitle: { color: Colors.ink, fontSize: 24, fontWeight: FontWeight.extrabold }, cardSubtitle: { marginTop: 4, marginBottom: 22, color: Colors.textSecondary, fontSize: FontSize.sm },
  label: { marginBottom: 7, color: Colors.ink, fontSize: 12, fontWeight: FontWeight.bold }, passwordLabel: { marginTop: 15 },
  inputWrap: { height: 52, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: Colors.cream }, input: { flex: 1, color: Colors.ink, fontSize: 15 },
  error: { marginTop: 12, color: '#B42318', fontSize: 12, lineHeight: 17 },
  primary: { height: 54, marginTop: 20, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, backgroundColor: Colors.primary },
  divider: { marginVertical: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border }, dividerText: { color: Colors.textMuted, fontSize: 9, fontWeight: FontWeight.bold },
  guest: { minHeight: 66, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: Colors.primaryLighter },
  guestTitle: { color: Colors.ink, fontSize: 12, fontWeight: FontWeight.bold }, guestCopy: { marginTop: 2, color: Colors.textMuted, fontSize: 9 },
  help: { marginTop: 22, color: Colors.textMuted, fontSize: 10, textAlign: 'center' },
});
