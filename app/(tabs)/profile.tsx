import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Spacing, Typography } from '../../constants';
import { useAuth } from '../../store/authStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function MenuRow({ icon, label, detail, last, onPress }: { icon: IconName; label: string; detail?: string; last?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={[styles.menuRow, last && styles.menuRowLast]} onPress={onPress} activeOpacity={0.72}>
      <View style={styles.menuIcon}><Ionicons name={icon} size={20} color={Colors.ink} /></View>
      <View style={styles.menuCopy}><Text style={styles.menuLabel}>{label}</Text>{detail ? <Text style={styles.menuDetail}>{detail}</Text> : null}</View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 36, 520);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Ivybee learner';
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'IB';
  const roleLabel = user?.role === 'parent' ? 'Parent account' : 'Student · Grade 9';

  const signOut = () => Alert.alert('Sign out of Ivybee?', 'You can return to either demo from the welcome screen.', [
    { text: 'Stay signed in', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
  ]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page, { width: contentWidth }]}>
        <View style={styles.header}><View><Text style={styles.kicker}>YOUR IVYBEE</Text><Text style={styles.title}>Profile</Text></View><TouchableOpacity style={styles.settings}><Ionicons name="settings-outline" size={20} color={Colors.ink} /></TouchableOpacity></View>

        <View style={styles.profileCard}>
          <View style={styles.profileGlow} />
          <View style={styles.avatar}><Text>{initials}</Text></View>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleChip}><View /><Text>{roleLabel}</Text></View>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: Colors.primaryLight }]}><Ionicons name="flame" size={21} color={Colors.goldDark} /><Text style={styles.badgeValue}>7</Text><Text style={styles.badgeLabel}>Day streak</Text></View>
          <View style={[styles.badge, { backgroundColor: Colors.lilacLight }]}><Ionicons name="diamond-outline" size={21} color={Colors.lilac} /><Text style={styles.badgeValue}>1,240</Text><Text style={styles.badgeLabel}>Total XP</Text></View>
          <View style={[styles.badge, { backgroundColor: Colors.mintLight }]}><Ionicons name="ribbon-outline" size={21} color={Colors.success} /><Text style={styles.badgeValue}>8</Text><Text style={styles.badgeLabel}>Achievements</Text></View>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="person-outline" label="Personal details" detail="Name, email and school" />
          <MenuRow icon="notifications-outline" label="Notifications" detail="Learning and family updates" />
          <MenuRow icon="shield-checkmark-outline" label="Privacy & safety" detail="Controls built for families" last />
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="language-outline" label="Language" detail="English (South Africa)" />
          <MenuRow icon="accessibility-outline" label="Learning preferences" detail="Pace, reminders and accessibility" />
          <MenuRow icon="help-circle-outline" label="Help & support" last />
        </View>

        <TouchableOpacity style={styles.signOut} onPress={signOut}><Ionicons name="log-out-outline" size={19} color={Colors.error} /><Text>Sign out</Text></TouchableOpacity>
        <View style={styles.brandFooter}><Text style={styles.footerBrand}>Ivybee</Text><Text style={styles.footerByline}>BY IVY BRILLIANCE · DEMO 1.0</Text></View>
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  page: { alignSelf: 'center' },
  header: { height: 86, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.3 },
  title: { marginTop: 2, color: Colors.ink, fontFamily: Typography.display, fontSize: 29, fontWeight: FontWeight.extrabold, letterSpacing: -1 },
  settings: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.paper },
  profileCard: { minHeight: 238, padding: 22, overflow: 'hidden', alignItems: 'center', borderRadius: Radius.xl, backgroundColor: Colors.ink },
  profileGlow: { position: 'absolute', top: -95, width: 250, height: 180, borderRadius: 125, backgroundColor: '#37372F' },
  avatar: { width: 78, height: 78, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderWidth: 4, borderColor: '#2D2D28' },
  name: { marginTop: 14, color: Colors.textInverse, fontSize: 23, fontWeight: FontWeight.extrabold, letterSpacing: -.5 },
  email: { marginTop: 3, color: '#92928A', fontSize: 10 },
  roleChip: { marginTop: 14, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: Radius.full, backgroundColor: '#2D2D28' },
  badgeRow: { marginTop: 11, flexDirection: 'row', gap: 8 },
  badge: { flex: 1, minHeight: 112, padding: 12, borderRadius: Radius.lg },
  badgeValue: { marginTop: 10, color: Colors.ink, fontSize: 17, fontWeight: FontWeight.extrabold },
  badgeLabel: { marginTop: 1, color: Colors.textSecondary, fontSize: 8 },
  sectionLabel: { marginTop: 26, marginBottom: 9, color: Colors.textMuted, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.2 },
  menuCard: { overflow: 'hidden', borderRadius: Radius.lg, backgroundColor: Colors.paper },
  menuRow: { minHeight: 72, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: '#ECE8DE' },
  menuRowLast: { borderBottomWidth: 0 },
  menuIcon: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceAlt },
  menuCopy: { flex: 1 },
  menuLabel: { color: Colors.ink, fontSize: 12, fontWeight: FontWeight.bold },
  menuDetail: { marginTop: 2, color: Colors.textMuted, fontSize: 9 },
  signOut: { height: 50, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: '#E4C4C0', borderRadius: Radius.md, backgroundColor: Colors.errorLight },
  brandFooter: { marginTop: 28, alignItems: 'center' },
  footerBrand: { color: Colors.ink, fontSize: 18, fontWeight: FontWeight.extrabold },
  footerByline: { marginTop: 3, color: Colors.textMuted, fontSize: 7, fontWeight: FontWeight.bold, letterSpacing: 1.1 },
});
