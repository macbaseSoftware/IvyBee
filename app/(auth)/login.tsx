import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius, Typography } from '../../constants';
import { api, setAuthToken } from '../../services/api';
import { AuthUser, useAuth } from '../../store/authStore';

type DemoRole = 'student' | 'parent';

function BeeMark() {
  return (
    <View style={styles.beeMark}>
      <View style={[styles.wing, styles.wingLeft]} />
      <View style={[styles.wing, styles.wingRight]} />
      <View style={styles.beeBody}>
        <View style={styles.beeStripe} />
        <View style={styles.beeStripe} />
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 40, 440);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const startDemo = async (role: DemoRole) => {
    const user: AuthUser = role === 'parent'
      ? { id: 9002, email: 'nomsa@ivybee.demo', role, firstName: 'Nomsa', lastName: 'Mokoena' }
      : { id: 9001, email: 'amara@ivybee.demo', role, firstName: 'Amara', lastName: 'Mokoena' };
    await login(`ivybee-demo-${role}`, user);
    router.replace('/(tabs)/home');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Almost there', 'Enter your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(email.trim().toLowerCase(), password) as any;
      const token = response.data?.access_token ?? response.access_token ?? response.token;
      if (!token) throw new Error('The sign-in service did not return an access token.');
      const userData = response.data?.user ?? response.user ?? {};
      setAuthToken(token);
      await login(token, {
        id: userData.id ?? 0,
        email: userData.email ?? email.trim().toLowerCase(),
        role: userData.role ?? 'student',
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Sign in failed', error.message ?? 'Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.brandRow, { width: contentWidth }]}>
            <BeeMark />
            <View>
              <Text style={styles.brandName}>Ivybee</Text>
              <Text style={styles.brandByline}>BY IVY BRILLIANCE</Text>
            </View>
          </View>

          <View style={[styles.heroCopy, { width: contentWidth }]}>
            <Text style={styles.eyebrow}>LEARN · GROW · PLAY</Text>
            <Text style={styles.heroTitle}>Your learning,{`\n`}in motion.</Text>
            <Text style={styles.heroText}>A focused space for students and families—with just enough play to keep progress feeling good.</Text>
          </View>

          <View style={[styles.card, { width: contentWidth }, Platform.OS === 'web' && ({ boxSizing: 'border-box' } as any)]}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue your Ivybee journey.</Text>

            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={19} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.forgot}>Forgot password?</Text>
            </View>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={19} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
              {loading ? <ActivityIndicator color={Colors.ink} /> : (
                <><Text style={styles.signInText}>Sign in</Text><Ionicons name="arrow-forward" size={19} color={Colors.ink} /></>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}><View style={styles.dividerLine} /><Text style={styles.dividerText}>QUICK DEMO</Text><View style={styles.dividerLine} /></View>
            <Text style={styles.demoLabel}>Choose the view you want to explore</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity style={styles.demoButton} onPress={() => startDemo('student')} activeOpacity={0.8}>
                <View style={[styles.demoIcon, { backgroundColor: Colors.lilacLight }]}><Ionicons name="school-outline" size={20} color={Colors.lilac} /></View>
                <View><Text style={styles.demoTitle}>Student</Text><Text style={styles.demoText}>My day & learning</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.demoButton} onPress={() => startDemo('parent')} activeOpacity={0.8}>
                <View style={[styles.demoIcon, { backgroundColor: Colors.mintLight }]}><Ionicons name="people-outline" size={20} color={Colors.success} /></View>
                <View><Text style={styles.demoTitle}>Parent</Text><Text style={styles.demoText}>Progress & support</Text></View>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.footer, { width: contentWidth }]}>One learning ecosystem. The right view for every role.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: Colors.ink },
  container: { flexGrow: 1, paddingTop: 12, paddingBottom: 26, fontFamily: Typography.body },
  brandRow: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandName: { color: Colors.textInverse, fontFamily: Typography.display, fontSize: 24, fontWeight: FontWeight.extrabold, letterSpacing: -1 },
  brandByline: { color: Colors.primary, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 2.1 },
  beeMark: { width: 44, height: 39, position: 'relative' },
  wing: { position: 'absolute', top: 2, width: 21, height: 18, borderWidth: 2, borderColor: Colors.primary, backgroundColor: 'rgba(255,255,255,.12)' },
  wingLeft: { left: 1, borderTopLeftRadius: 16, borderBottomRightRadius: 12, transform: [{ rotate: '-20deg' }] },
  wingRight: { right: 1, borderTopRightRadius: 16, borderBottomLeftRadius: 12, transform: [{ rotate: '20deg' }] },
  beeBody: { position: 'absolute', left: 12, top: 12, width: 22, height: 27, borderRadius: 12, overflow: 'hidden', backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.primary },
  beeStripe: { height: 5, marginTop: 4, backgroundColor: Colors.ink },
  heroCopy: { alignSelf: 'center', paddingVertical: 30 },
  eyebrow: { color: Colors.primary, fontSize: 10, fontWeight: FontWeight.extrabold, letterSpacing: 2.4 },
  heroTitle: { marginTop: 9, color: Colors.textInverse, fontFamily: Typography.display, fontSize: 41, lineHeight: 43, fontWeight: FontWeight.extrabold, letterSpacing: -1.9 },
  heroText: { marginTop: 13, maxWidth: 340, color: '#B8B8AF', fontSize: FontSize.sm, lineHeight: 20 },
  card: { alignSelf: 'center', padding: 21, borderRadius: Radius.xl, backgroundColor: Colors.paper },
  cardTitle: { color: Colors.ink, fontFamily: Typography.display, fontSize: 24, fontWeight: FontWeight.extrabold, letterSpacing: -.7 },
  cardSubtitle: { marginTop: 4, marginBottom: 20, color: Colors.textSecondary, fontSize: FontSize.sm },
  label: { marginBottom: 7, color: Colors.ink, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  passwordLabelRow: { marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' },
  forgot: { color: Colors.goldDark, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  inputWrap: { height: 52, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: '#F7F4EC' },
  input: { flex: 1, color: Colors.ink, fontFamily: Typography.body, fontSize: FontSize.md },
  signInButton: { height: 54, marginTop: 20, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: Radius.md, backgroundColor: Colors.primary },
  signInText: { color: Colors.ink, fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  dividerRow: { marginVertical: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1.4 },
  demoLabel: { marginTop: -7, marginBottom: 11, color: Colors.textSecondary, fontSize: FontSize.xs, textAlign: 'center' },
  demoRow: { flexDirection: 'row', gap: 9 },
  demoButton: { flex: 1, minHeight: 78, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: Colors.paper },
  demoIcon: { width: 37, height: 37, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  demoTitle: { color: Colors.ink, fontSize: 13, fontWeight: FontWeight.extrabold },
  demoText: { marginTop: 2, color: Colors.textMuted, fontSize: 9 },
  footer: { alignSelf: 'center', marginTop: 19, color: '#82827B', fontSize: 10, textAlign: 'center' },
});
