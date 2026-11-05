import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Spacing, Typography } from '../../constants';
import { useAuth } from '../../store/authStore';

const subjects = [
  { name: 'Mathematics', detail: 'Algebra foundations', progress: 88, change: '+12%', icon: 'calculator-outline' as const, tone: Colors.primaryLight, accent: Colors.primaryMid },
  { name: 'English', detail: 'Reading & comprehension', progress: 82, change: '+4%', icon: 'book-outline' as const, tone: Colors.lilacLight, accent: Colors.lilac },
  { name: 'Natural Sciences', detail: 'Matter and materials', progress: 76, change: '+7%', icon: 'flask-outline' as const, tone: Colors.mintLight, accent: Colors.mint },
];

export default function ProgressScreen() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 36, 520);
  const isParent = user?.role === 'parent';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page, { width: contentWidth }]}>
        <View style={styles.header}>
          <View><Text style={styles.kicker}>{isParent ? 'AMARA · GRADE 9' : 'YOUR LEARNING'}</Text><Text style={styles.title}>Progress</Text></View>
          <TouchableOpacity style={styles.calendar}><Ionicons name="calendar-outline" size={19} color={Colors.ink} /><Text>This week</Text></TouchableOpacity>
        </View>

        <View style={styles.scoreCard}>
          <View><Text style={styles.scoreKicker}>WEEKLY LEARNING SCORE</Text><Text style={styles.score}>84</Text><Text style={styles.scoreCaption}>Strong momentum</Text></View>
          <View style={styles.scoreRing}><View style={styles.scoreRingInner}><Ionicons name="trending-up" size={25} color={Colors.primary} /><Text>+6%</Text></View></View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}><Ionicons name="time-outline" size={20} color={Colors.goldDark} /><Text style={styles.metricValue}>4h 20m</Text><Text style={styles.metricLabel}>Focused time</Text></View>
          <View style={styles.metric}><Ionicons name="checkmark-circle-outline" size={20} color={Colors.success} /><Text style={styles.metricValue}>8 / 10</Text><Text style={styles.metricLabel}>Tasks finished</Text></View>
          <View style={styles.metric}><Ionicons name="flame-outline" size={20} color={Colors.coral} /><Text style={styles.metricValue}>7 days</Text><Text style={styles.metricLabel}>Learning streak</Text></View>
        </View>

        <View style={styles.sectionHead}><View><Text style={styles.sectionKicker}>SUBJECTS</Text><Text style={styles.sectionTitle}>{isParent ? 'Where support matters' : 'Your confidence'}</Text></View><Text style={styles.info}>Last 7 days</Text></View>
        <View style={styles.subjectList}>
          {subjects.map(subject => (
            <TouchableOpacity style={styles.subject} key={subject.name} activeOpacity={0.75}>
              <View style={[styles.subjectIcon, { backgroundColor: subject.tone }]}><Ionicons name={subject.icon} size={21} color={subject.accent} /></View>
              <View style={styles.subjectMain}>
                <View style={styles.subjectTop}><View><Text style={styles.subjectName}>{subject.name}</Text><Text style={styles.subjectDetail}>{subject.detail}</Text></View><View><Text style={styles.subjectPercent}>{subject.progress}%</Text><Text style={styles.subjectChange}>{subject.change}</Text></View></View>
                <View style={styles.track}><View style={[styles.fill, { width: `${subject.progress}%`, backgroundColor: subject.accent }]} /></View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHead}><View><Text style={styles.sectionKicker}>ACTIVITY</Text><Text style={styles.sectionTitle}>Recent wins</Text></View></View>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}><View style={[styles.timelineDot, { backgroundColor: Colors.primary }]}><Ionicons name="trophy-outline" size={18} color={Colors.ink} /></View><View><Text style={styles.timelineTitle}>New personal best</Text><Text style={styles.timelineText}>92% in Algebra Foundations</Text></View><Text style={styles.timelineTime}>Today</Text></View>
          <View style={styles.timelineItem}><View style={[styles.timelineDot, { backgroundColor: Colors.lilacLight }]}><Ionicons name="game-controller-outline" size={18} color={Colors.lilac} /></View><View><Text style={styles.timelineTitle}>Memory Matrix complete</Text><Text style={styles.timelineText}>Level 6 · 1,240 XP earned</Text></View><Text style={styles.timelineTime}>Yesterday</Text></View>
          <View style={styles.timelineItem}><View style={[styles.timelineDot, { backgroundColor: Colors.mintLight }]}><Ionicons name="checkmark-done" size={18} color={Colors.success} /></View><View><Text style={styles.timelineTitle}>Weekly goal reached</Text><Text style={styles.timelineText}>Four hours of focused learning</Text></View><Text style={styles.timelineTime}>Friday</Text></View>
        </View>

        {isParent && (
          <View style={styles.parentNote}><Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.ink} /><View><Text style={styles.parentNoteTitle}>A good conversation starter</Text><Text style={styles.parentNoteText}>Ask Amara to show you how she solves a two-step equation. Explaining it aloud helps reinforce the method.</Text></View></View>
        )}
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
  calendar: { paddingHorizontal: 11, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: Radius.md, backgroundColor: Colors.paper },
  scoreCard: { minHeight: 185, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.xl, backgroundColor: Colors.ink },
  scoreKicker: { color: '#97978E', fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.2 },
  score: { marginTop: 8, color: Colors.textInverse, fontSize: 62, lineHeight: 66, fontWeight: FontWeight.extrabold },
  scoreCaption: { color: Colors.primary, fontSize: 11, fontWeight: FontWeight.bold },
  scoreRing: { width: 107, height: 107, borderRadius: 54, padding: 8, backgroundColor: Colors.primary },
  scoreRingInner: { flex: 1, borderRadius: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ink },
  metricRow: { marginTop: 11, flexDirection: 'row', gap: 8 },
  metric: { flex: 1, minHeight: 102, padding: 12, borderRadius: Radius.lg, backgroundColor: Colors.paper },
  metricValue: { marginTop: 9, color: Colors.ink, fontSize: 15, fontWeight: FontWeight.extrabold },
  metricLabel: { marginTop: 2, color: Colors.textMuted, fontSize: 8 },
  sectionHead: { marginTop: 28, marginBottom: 11, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionKicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.2 },
  sectionTitle: { marginTop: 3, color: Colors.ink, fontSize: 22, fontWeight: FontWeight.extrabold, letterSpacing: -.6 },
  info: { color: Colors.textMuted, fontSize: 10 },
  subjectList: { overflow: 'hidden', borderRadius: Radius.lg, backgroundColor: Colors.paper },
  subject: { minHeight: 100, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#ECE8DE' },
  subjectIcon: { width: 43, height: 43, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  subjectMain: { flex: 1 },
  subjectTop: { marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  subjectName: { color: Colors.ink, fontSize: 13, fontWeight: FontWeight.extrabold },
  subjectDetail: { marginTop: 2, color: Colors.textMuted, fontSize: 9 },
  subjectPercent: { color: Colors.ink, fontSize: 15, fontWeight: FontWeight.extrabold, textAlign: 'right' },
  subjectChange: { color: Colors.success, fontSize: 8, fontWeight: FontWeight.bold, textAlign: 'right' },
  track: { height: 6, overflow: 'hidden', borderRadius: 6, backgroundColor: '#EAE6DC' },
  fill: { height: '100%', borderRadius: 6 },
  timeline: { padding: 5, borderRadius: Radius.lg, backgroundColor: Colors.paper },
  timelineItem: { minHeight: 72, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 10 },
  timelineDot: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  timelineTitle: { color: Colors.ink, fontSize: 12, fontWeight: FontWeight.bold },
  timelineText: { marginTop: 2, color: Colors.textMuted, fontSize: 9 },
  timelineTime: { marginLeft: 'auto', color: Colors.textMuted, fontSize: 8 },
  parentNote: { marginTop: 14, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 11, borderRadius: Radius.lg, backgroundColor: Colors.primary },
  parentNoteTitle: { color: Colors.ink, fontSize: 12, fontWeight: FontWeight.extrabold },
  parentNoteText: { marginTop: 4, maxWidth: 290, color: '#665013', fontSize: 9, lineHeight: 14 },
});
