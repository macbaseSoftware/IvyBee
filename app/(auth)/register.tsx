import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants';
import { api, setAuthToken } from '../../services/api';
import { useAuth } from '../../store/authStore';

type Role = 'student' | 'instructor';

export default function RegisterScreen() {
  const { login } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // POST /api/users/create
      const res = await api.register({
        email: email.trim().toLowerCase(),
        password,
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      const accessToken = res.access_token;
      if (!accessToken) throw new Error('The registration service did not return an access token.');
      setAuthToken(accessToken);

      let userData: any = res.user;
      if (!userData) {
        try {
          userData = await api.getMe();
        } catch {
          try {
            const base64Payload = accessToken.split('.')[1];
            const decoded = JSON.parse(
              typeof atob !== 'undefined'
                ? atob(base64Payload)
                : Buffer.from(base64Payload, 'base64').toString('utf8')
            );
            userData = { id: decoded.sub, email: decoded.email ?? email, role: decoded.role ?? role };
          } catch {
            userData = { id: 0, email, role };
          }
        }
      }

      await login(accessToken, {
        id: userData.id,
        email: userData.email ?? email,
        role: userData.role ?? role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message ?? 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>I</Text>
          </View>
          <Text style={styles.brandName}>Join IvyBrilliance</Text>
          <Text style={styles.tagline}>Start your learning journey today</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>

          <View style={styles.roleRow}>
            {(['student', 'instructor'] as Role[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, role === r && styles.roleChipActive]}
                onPress={() => setRole(r)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                  {r === 'student' ? '🎓 Student' : '👨‍🏫 Instructor'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.nameRow}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>First name *</Text>
              <TextInput style={styles.input} value={firstName} onChangeText={setFirstName}
                placeholder="John" placeholderTextColor={Colors.textMuted} autoCapitalize="words" />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Last name</Text>
              <TextInput style={styles.input} value={lastName} onChangeText={setLastName}
                placeholder="Doe" placeholderTextColor={Colors.textMuted} autoCapitalize="words" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address *</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail}
              placeholder="you@example.com" placeholderTextColor={Colors.textMuted}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword}
              placeholder="Min. 6 characters" placeholderTextColor={Colors.textMuted} secureTextEntry />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm password *</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword}
              placeholder="Repeat your password" placeholderTextColor={Colors.textMuted}
              secureTextEntry returnKeyType="done" onSubmitEditing={handleRegister} />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister} disabled={loading} activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color={Colors.textInverse} /> : <Text style={styles.buttonText}>Create Account</Text>}
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.primary },
  container: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  backButton: { marginTop: Spacing.xxl, paddingVertical: Spacing.sm },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: FontSize.md, fontWeight: FontWeight.medium },
  header: { alignItems: 'center', paddingVertical: Spacing.xl },
  logoMark: {
    width: 56, height: 56, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  logoLetter: { fontSize: 28, fontWeight: FontWeight.extrabold, color: Colors.textInverse },
  brandName: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textInverse },
  tagline: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: Spacing.xs },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg,
    shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1, shadowRadius: 24, elevation: 12, marginBottom: Spacing.xl,
  },
  cardTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  roleRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  roleChip: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  roleChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  roleChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary },
  roleChipTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  nameRow: { flexDirection: 'row', gap: Spacing.sm },
  halfField: { flex: 1 },
  fieldGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.xs },
  input: {
    height: 50, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    fontSize: FontSize.md, color: Colors.textPrimary, backgroundColor: Colors.surfaceAlt,
  },
  button: {
    height: 52, backgroundColor: Colors.primary, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center', marginTop: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textInverse },
  loginPrompt: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  loginPromptText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.primary },
});
