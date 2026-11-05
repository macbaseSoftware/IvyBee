import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Spacing, Typography } from '../../constants';
import { useAuth } from '../../store/authStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const parentSubjects = [
  { name: 'Mathematics', value: '88%', progress: 88, tone: Colors.primary },
  { name: 'English', value: '82%', progress: 82, tone: Colors.lilac },
  { name: 'Natural Sciences', value: '76%', progress: 76, tone: Colors.mint },
];

function BrandLockup() {
  return (
    <View style={styles.brandLockup}>
      <View style={styles.brandDot}><Ionicons name="sparkles" size={17} color={Colors.ink} /></View>
      <Text style={styles.brandText}>Ivybee</Text>
    </View>
  );
}

function PlanItem({ icon, title, subject, time, tone, done }: { icon: IconName; title: string; subject: string; time: string; tone: string; done?: boolean }) {
  return (
    <TouchableOpacity style={styles.planItem} activeOpacity={0.76}>
      <View style={[styles.planIcon, { backgroundColor: tone }]}><Ionicons name={done ? 'checkmark' : icon} size={19} color={Colors.ink} /></View>
      <View style={styles.planCopy}><Text style={styles.planTitle}>{title}</Text><Text style={styles.planMeta}>{subject} · {time}</Text></View>
      <Ionicons name={done ? 'checkmark-circle' : 'chevron-forward'} size={20} color={done ? Colors.success : Colors.textMuted} />
    </TouchableOpacity>
  );
}

function StudentHome({ firstName }: { firstName: string }) {
  return (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}><Text style={styles.heroEyebrow}>TODAY’S FOCUS</Text><View style={styles.streakChip}><Ionicons name="flame" size={15} color={Colors.primary} /><Text>7 day streak</Text></View></View>
        <Text style={styles.heroTitle}>Keep your{`\n`}momentum, {firstName}.</Text>
        <Text style={styles.heroBody}>Three focused tasks. About 45 minutes. Then the rest of the day is yours.</Text>
        <View style={styles.heroProgressRow}><View style={styles.heroProgress}><View style={styles.heroProgressFill} /></View><Text style={styles.heroProgressText}>1 of 3 done</Text></View>
        <TouchableOpacity style={styles.heroButton} activeOpacity={0.85}><Text>Continue learning</Text><Ionicons name="arrow-forward" size={18} color={Colors.ink} /></TouchableOpacity>
        <View style={styles.heroOrb}><Text style={styles.heroOrbValue}>42</Text><Text style={styles.heroOrbLabel}>MIN</Text></View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}><Text style={styles.statLabel}>THIS WEEK</Text><Text style={styles.statValue}>4h 20m</Text><Text style={styles.statDelta}>↑ 35 min</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>AVG. SCORE</Text><Text style={styles.statValue}>84%</Text><Text style={styles.statDelta}>↑ 6%</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>XP EARNED</Text><Text style={styles.statValue}>1,240</Text><Text style={[styles.statDelta, { color: Colors.goldDark }]}>Level 8</Text></View>
      </View>

      <View style={styles.sectionHeader}><View><Text style={styles.sectionKicker}>YOUR PLAN</Text><Text style={styles.sectionTitle}>Up next</Text></View><TouchableOpacity onPress={() => router.push('/(tabs)/my-learning')}><Text style={styles.link}>View progress</Text></TouchableOpacity></View>
      <View style={styles.planCard}>
        <PlanItem icon="calculator-outline" title="Linear equations: recap" subject="Mathematics" time="12 min" tone={Colors.mintLight} done />
        <PlanItem icon="play" title="Algebra foundations" subject="Mathematics" time="18 min" tone={Colors.primaryLight} />
        <PlanItem icon="book-outline" title="Reading inference" subject="English" time="15 min" tone={Colors.lilacLight} />
      </View>

      <View style={styles.sectionHeader}><View><Text style={styles.sectionKicker}>PRACTICE THROUGH PLAY</Text><Text style={styles.sectionTitle}>Game studio</Text></View><Text style={styles.link}>See all</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gameRow}>
        <TouchableOpacity style={[styles.gameCard, { backgroundColor: Colors.lilac }]} activeOpacity={0.85}>
          <View style={styles.gameGrid}>{[1, 2, 3, 4, 5, 6].map(n => <View key={n} style={[styles.gameTile, n === 2 || n === 5 ? styles.gameTileGold : null]} />)}</View>
          <Text style={styles.gameTag}>RECALL & PATTERNS</Text><Text style={styles.gameTitle}>Memory Matrix</Text><Text style={styles.gameAction}>Play now  →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.gameCard, { backgroundColor: Colors.primary }]} activeOpacity={0.85}>
          <View style={styles.equation}><Text>12</Text><Text>×</Text><Text>8</Text></View>
          <Text style={[styles.gameTag, { color: Colors.ink }]}>MENTAL SPEED</Text><Text style={[styles.gameTitle, { color: Colors.ink }]}>Quick Maths</Text><Text style={[styles.gameAction, { color: Colors.ink }]}>Start round  →</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

function ParentHome({ firstName }: { firstName: string }) {
  return (
    <>
      <View style={styles.parentHero}>
        <View style={styles.parentEyebrow}><Ionicons name="shield-checkmark" size={15} color={Colors.primary} /><Text style={styles.parentEyebrowText}>FAMILY OVERVIEW</Text></View>
        <Text style={styles.parentTitle}>Good progress this week, {firstName}.</Text>
        <Text style={styles.parentBody}>Amara completed 8 learning activities and improved most in Mathematics.</Text>
        <View style={styles.childRow}><View style={styles.childAvatar}><Text>AM</Text></View><View style={styles.childCopy}><Text style={styles.childName}>Amara Mokoena</Text><Text style={styles.childMeta}>Grade 9 · Ivy Lane Academy</Text></View><Ionicons name="chevron-down" size={19} color={Colors.textMuted} /></View>
      </View>

      <View style={styles.parentStats}>
        <View style={[styles.parentStat, { backgroundColor: Colors.primaryLight }]}><Ionicons name="time-outline" size={21} color={Colors.goldDark} /><Text style={styles.parentStatValue}>4h 20m</Text><Text style={styles.parentStatLabel}>Learning time</Text></View>
        <View style={[styles.parentStat, { backgroundColor: Colors.mintLight }]}><Ionicons name="trending-up" size={21} color={Colors.success} /><Text style={styles.parentStatValue}>84%</Text><Text style={styles.parentStatLabel}>Average score</Text></View>
        <View style={[styles.parentStat, { backgroundColor: Colors.lilacLight }]}><Ionicons name="checkmark-done" size={21} color={Colors.lilac} /><Text style={styles.parentStatValue}>8</Text><Text style={styles.parentStatLabel}>Tasks complete</Text></View>
        <View style={[styles.parentStat, { backgroundColor: Colors.skyLight }]}><Ionicons name="flame" size={21} color={Colors.sky} /><Text style={styles.parentStatValue}>7 days</Text><Text style={styles.parentStatLabel}>Current streak</Text></View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightIcon}><Ionicons name="bulb-outline" size={24} color={Colors.ink} /></View>
        <View style={styles.insightCopy}><Text style={styles.insightKicker}>WEEKLY INSIGHT</Text><Text style={styles.insightTitle}>Mathematics confidence is growing.</Text><Text style={styles.insightBody}>Amara’s algebra score increased by 12%. A short recap on Friday will help make it stick.</Text></View>
      </View>

      <View style={styles.sectionHeader}><View><Text style={styles.sectionKicker}>THIS WEEK</Text><Text style={styles.sectionTitle}>Subject progress</Text></View><TouchableOpacity onPress={() => router.push('/(tabs)/my-learning')}><Text style={styles.link}>Full report</Text></TouchableOpacity></View>
      <View style={styles.subjectCard}>
        {parentSubjects.map(({ name, value, progress, tone }) => (
          <View style={styles.subjectRow} key={name}><View style={styles.subjectHeading}><Text>{name}</Text><Text>{value}</Text></View><View style={styles.subjectTrack}><View style={[styles.subjectFill, { width: `${progress}%` as `${number}%`, backgroundColor: tone }]} /></View></View>
        ))}
      </View>

      <View style={styles.handoverCard}>
        <View style={styles.handoverIcon}><Ionicons name="game-controller-outline" size={25} color={Colors.ink} /></View>
        <View style={styles.handoverCopy}><Text style={styles.handoverTitle}>Ivybee Kids</Text><Text style={styles.handoverBody}>Start a safe game session, then hand over your phone. Parent information stays hidden.</Text></View>
        <TouchableOpacity style={styles.handoverButton}><Ionicons name="arrow-forward" size={18} color={Colors.textInverse} /></TouchableOpacity>
      </View>
    </>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 36, 520);
  const isParent = user?.role === 'parent';
  const firstName = user?.firstName ?? (isParent ? 'Nomsa' : 'Amara');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page, { width: contentWidth }]}>
        <View style={styles.topBar}>
          <BrandLockup />
          <View style={styles.topActions}><TouchableOpacity style={styles.iconButton}><Ionicons name="notifications-outline" size={21} color={Colors.ink} /><View style={styles.notificationDot} /></TouchableOpacity><TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}><Text>{firstName.slice(0, 1)}</Text></TouchableOpacity></View>
        </View>
        <View style={styles.welcomeRow}><View><Text style={styles.welcomeKicker}>{isParent ? 'MONDAY · 2 NOVEMBER' : 'READY WHEN YOU ARE'}</Text><Text style={styles.welcomeTitle}>{isParent ? `Hello, ${firstName}` : `Hey, ${firstName} 👋`}</Text></View><View style={styles.demoPill}><View style={styles.demoDot} /><Text style={styles.demoText}>{isParent ? 'Parent demo' : 'Student demo'}</Text></View></View>
        {isParent ? <ParentHome firstName={firstName} /> : <StudentHome firstName={firstName} />}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  page: { alignSelf: 'center', paddingBottom: 12 },
  topBar: { height: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  brandText: { color: Colors.ink, fontFamily: Typography.display, fontSize: 22, fontWeight: FontWeight.extrabold, letterSpacing: -.8 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  iconButton: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.paper, borderWidth: 1, borderColor: Colors.border },
  notificationDot: { position: 'absolute', right: 9, top: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.coral },
  avatar: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ink },
  welcomeRow: { marginTop: 5, marginBottom: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  welcomeKicker: { color: Colors.textMuted, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.3 },
  welcomeTitle: { marginTop: 3, color: Colors.ink, fontFamily: Typography.display, fontSize: 25, fontWeight: FontWeight.extrabold, letterSpacing: -.8 },
  demoPill: { paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: Radius.full, backgroundColor: Colors.paper },
  demoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  demoText: { color: Colors.textSecondary, fontSize: 8, fontWeight: FontWeight.bold },
  heroCard: { minHeight: 300, padding: 21, overflow: 'hidden', borderRadius: Radius.xl, backgroundColor: Colors.ink },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroEyebrow: { color: Colors.primary, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.6 },
  streakChip: { paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, backgroundColor: '#2B2B25' },
  heroTitle: { marginTop: 28, color: Colors.textInverse, fontFamily: Typography.display, fontSize: 36, lineHeight: 38, fontWeight: FontWeight.extrabold, letterSpacing: -1.6 },
  heroBody: { marginTop: 11, maxWidth: 278, color: '#B9B9B0', fontSize: 12, lineHeight: 18 },
  heroProgressRow: { marginTop: 20, maxWidth: 240, flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroProgress: { flex: 1, height: 5, overflow: 'hidden', borderRadius: 5, backgroundColor: '#3B3B34' },
  heroProgressFill: { width: '34%', height: '100%', backgroundColor: Colors.primary },
  heroProgressText: { color: '#B9B9B0', fontSize: 9 },
  heroButton: { width: 180, height: 46, marginTop: 19, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, backgroundColor: Colors.primary },
  heroOrb: { position: 'absolute', right: -18, bottom: -20, width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2D2D27', borderWidth: 19, borderColor: '#23231F' },
  heroOrbValue: { color: Colors.primary, fontSize: 26, fontWeight: FontWeight.extrabold },
  heroOrbLabel: { color: '#8F8F86', fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 1 },
  statsRow: { marginTop: 12, flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, padding: 13, borderRadius: Radius.lg, backgroundColor: Colors.paper, borderWidth: 1, borderColor: '#E9E4D8' },
  statLabel: { color: Colors.textMuted, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: .8 },
  statValue: { marginTop: 7, color: Colors.ink, fontSize: 17, fontWeight: FontWeight.extrabold },
  statDelta: { marginTop: 3, color: Colors.success, fontSize: 9, fontWeight: FontWeight.bold },
  sectionHeader: { marginTop: 28, marginBottom: 11, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionKicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.2 },
  sectionTitle: { marginTop: 3, color: Colors.ink, fontFamily: Typography.display, fontSize: 23, fontWeight: FontWeight.extrabold, letterSpacing: -.7 },
  link: { color: Colors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold },
  planCard: { overflow: 'hidden', borderRadius: Radius.lg, backgroundColor: Colors.paper, borderWidth: 1, borderColor: Colors.border },
  planItem: { minHeight: 70, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: '#EEEAE0' },
  planIcon: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  planCopy: { flex: 1 },
  planTitle: { color: Colors.ink, fontSize: 13, fontWeight: FontWeight.bold },
  planMeta: { marginTop: 3, color: Colors.textMuted, fontSize: 10 },
  gameRow: { gap: 11, paddingRight: 18 },
  gameCard: { width: 244, minHeight: 235, padding: 18, borderRadius: Radius.xl },
  gameGrid: { width: 112, marginBottom: 26, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gameTile: { width: 32, height: 37, borderRadius: 7, backgroundColor: 'rgba(255,255,255,.18)' },
  gameTileGold: { backgroundColor: Colors.primary },
  gameTag: { color: '#E8E4FF', fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  gameTitle: { marginTop: 5, color: Colors.textInverse, fontSize: 23, fontWeight: FontWeight.extrabold, letterSpacing: -.5 },
  gameAction: { marginTop: 12, color: Colors.textInverse, fontSize: 11, fontWeight: FontWeight.bold },
  equation: { height: 112, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  parentHero: { padding: 22, borderRadius: Radius.xl, backgroundColor: Colors.ink },
  parentEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  parentEyebrowText: { color: Colors.primary, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.4 },
  parentTitle: { marginTop: 18, color: Colors.textInverse, fontSize: 31, lineHeight: 34, fontWeight: FontWeight.extrabold, letterSpacing: -1.2 },
  parentBody: { marginTop: 10, color: '#B9B9B0', fontSize: 12, lineHeight: 18 },
  childRow: { marginTop: 21, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: Radius.md, backgroundColor: '#292924' },
  childAvatar: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  childCopy: { flex: 1 },
  childName: { color: Colors.textInverse, fontSize: 13, fontWeight: FontWeight.bold },
  childMeta: { marginTop: 2, color: '#99998F', fontSize: 9 },
  parentStats: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  parentStat: { width: '48.6%', minHeight: 116, padding: 15, borderRadius: Radius.lg },
  parentStatValue: { marginTop: 12, color: Colors.ink, fontSize: 21, fontWeight: FontWeight.extrabold },
  parentStatLabel: { marginTop: 2, color: Colors.textSecondary, fontSize: 10 },
  insightCard: { marginTop: 13, padding: 16, flexDirection: 'row', gap: 12, borderRadius: Radius.lg, backgroundColor: Colors.primary },
  insightIcon: { width: 43, height: 43, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.42)' },
  insightCopy: { flex: 1 },
  insightKicker: { color: '#6E5100', fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  insightTitle: { marginTop: 5, color: Colors.ink, fontSize: 14, fontWeight: FontWeight.extrabold },
  insightBody: { marginTop: 5, color: '#5B490D', fontSize: 10, lineHeight: 15 },
  subjectCard: { padding: 16, gap: 18, borderRadius: Radius.lg, backgroundColor: Colors.paper },
  subjectRow: { gap: 2 },
  subjectHeading: { marginBottom: 7, flexDirection: 'row', justifyContent: 'space-between' },
  subjectTrack: { height: 7, overflow: 'hidden', borderRadius: 7, backgroundColor: '#EAE6DC' },
  subjectFill: { height: '100%', borderRadius: 7 },
  handoverCard: { marginTop: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderColor: '#DDC76F', borderRadius: Radius.lg, backgroundColor: '#FFF8DA' },
  handoverIcon: { width: 45, height: 45, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  handoverCopy: { flex: 1 },
  handoverTitle: { color: Colors.ink, fontSize: 14, fontWeight: FontWeight.extrabold },
  handoverBody: { marginTop: 3, color: Colors.textSecondary, fontSize: 9, lineHeight: 13 },
  handoverButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ink },
});
