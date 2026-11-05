import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { api, ParentChild } from '../../services/api';
import { enablePushNotifications } from '../../services/notifications';
import { useAuth } from '../../store/authStore';

export default function ChildrenScreen() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try { setChildren(await api.getChildren()); }
    catch (e: any) { setError(e.message ?? 'Could not load your children.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const firstName = user?.displayName.split(' ')[0] || 'Parent';
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.goldDark} />}>
        <View style={styles.top}><View><Text style={styles.brand}>Ivybee</Text><Text style={styles.byline}>IVY BRILLIANCE</Text></View><TouchableOpacity style={styles.bell} onPress={async () => { const result = await enablePushNotifications(true); Alert.alert(result.enabled ? 'Notifications enabled' : 'Notifications', result.reason); }}><Ionicons name="notifications-outline" size={21} color={Colors.ink} /></TouchableOpacity></View>
        <Text style={styles.eyebrow}>FAMILY OVERVIEW</Text>
        <Text style={styles.title}>Hello, {firstName}.</Text>
        <Text style={styles.intro}>Your children and their school groups are all here.</Text>

        <TouchableOpacity style={styles.updateCard} onPress={() => router.push('/(tabs)/groups')} activeOpacity={.85}>
          <View style={styles.updateIcon}><Ionicons name="chatbubble-ellipses" size={22} color={Colors.ink} /></View>
          <View style={styles.updateCopy}><Text style={styles.updateKicker}>NEW SCHOOL UPDATES</Text><Text style={styles.updateTitle}>See the latest from their teachers</Text></View>
          <Ionicons name="arrow-forward" size={20} color={Colors.ink} />
        </TouchableOpacity>

        <View style={styles.sectionHead}><Text style={styles.sectionTitle}>My children</Text><Text style={styles.count}>{children.length}</Text></View>
        {loading && children.length === 0 ? <ActivityIndicator style={styles.loader} color={Colors.goldDark} /> : null}
        {error ? <View style={styles.error}><Text>{error}</Text><TouchableOpacity onPress={load}><Text>Try again</Text></TouchableOpacity></View> : null}
        {children.map((child, index) => {
          const displayName = child.preferredName || child.firstName;
          return <TouchableOpacity key={child.id} style={styles.childCard} onPress={() => router.push('/(tabs)/groups')} activeOpacity={.82}>
            <View style={[styles.avatar, index % 2 ? styles.avatarAlt : null]}><Text>{displayName.slice(0, 1)}{child.lastName.slice(0, 1)}</Text></View>
            <View style={styles.childCopy}><Text style={styles.childName}>{displayName} {child.lastName}</Text><Text style={styles.school}>{child.schoolName}</Text><View style={styles.linkRow}><Ionicons name="people-outline" size={14} color={Colors.goldDark} /><Text>View class groups and updates</Text></View></View>
            <Ionicons name="chevron-forward" size={21} color={Colors.textMuted} />
          </TouchableOpacity>;
        })}
        {!loading && !error && children.length === 0 ? <View style={styles.empty}><Ionicons name="people-outline" size={30} color={Colors.textMuted} /><Text>No children are linked to this account yet.</Text><Text>Ask the school administrator to connect your guardian profile.</Text></View> : null}
        <TouchableOpacity style={styles.playCard} onPress={() => router.push({ pathname: '/games', params: { child: children[0]?.preferredName || children[0]?.firstName } })} activeOpacity={.85}>
          <View style={styles.playIcon}><Ionicons name="game-controller" size={23} color={Colors.ink} /></View>
          <View style={styles.playCopy}><Text>Play & learn together</Text><Text>Memory, mini Sudoku and 10-round maths</Text></View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} /><View><Text>Private family access</Text><Text>Only school-approved guardians can see these updates.</Text></View></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 18, paddingBottom: 34 },
  top: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { color: Colors.ink, fontFamily: Typography.display, fontSize: 24, fontWeight: FontWeight.extrabold, letterSpacing: -1 }, byline: { color: Colors.goldDark, fontSize: 7, fontWeight: FontWeight.extrabold, letterSpacing: 1.7 }, bell: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: Colors.paper },
  eyebrow: { marginTop: 16, color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.4 }, title: { marginTop: 6, color: Colors.ink, fontFamily: Typography.display, fontSize: 35, fontWeight: FontWeight.extrabold, letterSpacing: -1.4 }, intro: { marginTop: 6, color: Colors.textSecondary, fontSize: 13 },
  updateCard: { marginTop: 24, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radius.lg, backgroundColor: Colors.primary }, updateIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: 'rgba(255,255,255,.45)' }, updateCopy: { flex: 1 }, updateKicker: { color: '#745500', fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1 }, updateTitle: { marginTop: 4, color: Colors.ink, fontSize: 13, fontWeight: FontWeight.extrabold },
  sectionHead: { marginTop: 30, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }, sectionTitle: { color: Colors.ink, fontSize: 23, fontWeight: FontWeight.extrabold }, count: { minWidth: 24, paddingVertical: 3, textAlign: 'center', borderRadius: 12, overflow: 'hidden', backgroundColor: Colors.primaryLight, color: Colors.goldDark, fontSize: 10, fontWeight: FontWeight.bold },
  loader: { marginTop: 40 }, childCard: { minHeight: 112, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.paper }, avatar: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: Colors.primary }, avatarAlt: { backgroundColor: Colors.mintLight }, childCopy: { flex: 1 }, childName: { color: Colors.ink, fontSize: 16, fontWeight: FontWeight.extrabold }, school: { marginTop: 3, color: Colors.textMuted, fontSize: 10 }, linkRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  error: { padding: 16, gap: 10, borderRadius: Radius.md, backgroundColor: Colors.errorLight }, empty: { padding: 28, alignItems: 'center', gap: 7, borderRadius: Radius.lg, backgroundColor: Colors.paper }, privacy: { marginTop: 18, padding: 14, flexDirection: 'row', gap: 11, borderRadius: Radius.md, backgroundColor: Colors.mintLight },
  playCard: { marginTop: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: Radius.lg, backgroundColor: Colors.primaryLight }, playIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.primary }, playCopy: { flex: 1 },
});
