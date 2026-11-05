import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { api, CommunicationGroup } from '../../services/api';

export default function GroupsScreen() {
  const [groups, setGroups] = useState<CommunicationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { try { setError(''); setGroups(await api.getGroups()); } catch (e: any) { setError(e.message); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.kicker}>SCHOOL COMMUNICATION</Text><Text style={styles.title}>Class groups</Text><Text style={styles.intro}>Updates shared by your children&apos;s teachers and school.</Text>
    {loading ? <ActivityIndicator style={styles.loader} color={Colors.goldDark} /> : null}
    {error ? <TouchableOpacity style={styles.error} onPress={load}><Text>{error}</Text><Text>Tap to retry</Text></TouchableOpacity> : null}
    <View style={styles.list}>{groups.map(group => <TouchableOpacity key={group.id} style={styles.card} onPress={() => router.push({ pathname: '/group/[id]', params: { id: String(group.id), name: group.name, child: group.childNames[0] } })} activeOpacity={.82}>
      <View style={styles.icon}><Ionicons name="chatbubbles" size={23} color={Colors.ink} /></View><View style={styles.copy}><View style={styles.nameRow}><Text style={styles.name}>{group.name}</Text>{group.unreadCount > 0 ? <Text style={styles.badge}>{group.unreadCount}</Text> : null}</View><Text style={styles.teacher}>{group.teacherName || 'School team'} · {group.schoolName}</Text><Text style={styles.children}>{group.childNames.length ? `For ${group.childNames.join(', ')}` : 'Staff communication group'}</Text></View><Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>)}</View>
    {!loading && !error && groups.length === 0 ? <View style={styles.empty}><Ionicons name="chatbubbles-outline" size={32} color={Colors.textMuted} /><Text>No class groups are linked yet.</Text></View> : null}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 20, paddingBottom: 40 }, kicker: { marginTop: 20, color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.4 }, title: { marginTop: 6, color: Colors.ink, fontFamily: Typography.display, fontSize: 35, fontWeight: FontWeight.extrabold, letterSpacing: -1.3 }, intro: { marginTop: 7, color: Colors.textSecondary, fontSize: 13, lineHeight: 20 }, loader: { marginTop: 50 }, list: { marginTop: 26, gap: 10 }, card: { minHeight: 112, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.paper }, icon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: Colors.primary }, copy: { flex: 1 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 }, name: { color: Colors.ink, fontSize: 15, fontWeight: FontWeight.extrabold }, badge: { minWidth: 21, paddingVertical: 3, borderRadius: 11, overflow: 'hidden', backgroundColor: Colors.coral, color: Colors.textInverse, fontSize: 9, fontWeight: FontWeight.bold, textAlign: 'center' }, teacher: { marginTop: 4, color: Colors.textSecondary, fontSize: 10 }, children: { marginTop: 7, color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.bold }, error: { marginTop: 24, padding: 16, gap: 5, borderRadius: Radius.md, backgroundColor: Colors.errorLight }, empty: { marginTop: 30, padding: 30, alignItems: 'center', gap: 8, borderRadius: Radius.lg, backgroundColor: Colors.paper } });
