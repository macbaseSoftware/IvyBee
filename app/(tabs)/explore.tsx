import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Spacing, Typography } from '../../constants';

const categories = ['For you', 'Mathematics', 'Languages', 'Science'];
const programmes = [
  { title: 'Algebra without the panic', subject: 'MATHEMATICS', level: 'Grade 8–10', lessons: 12, progress: 34, icon: 'calculator-outline' as const, tone: Colors.primary, ink: Colors.ink },
  { title: 'Read between the lines', subject: 'ENGLISH', level: 'Grade 8–11', lessons: 8, progress: 0, icon: 'book-outline' as const, tone: Colors.lilac, ink: Colors.textInverse },
  { title: 'Matter, atoms & everything', subject: 'NATURAL SCIENCES', level: 'Grade 7–9', lessons: 10, progress: 0, icon: 'flask-outline' as const, tone: Colors.mint, ink: Colors.ink },
  { title: 'Money sense for real life', subject: 'LIFE SKILLS', level: 'Ages 13+', lessons: 6, progress: 0, icon: 'wallet-outline' as const, tone: Colors.coral, ink: Colors.ink },
];

export default function DiscoverScreen() {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 36, 520);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('For you');
  const filtered = useMemo(() => programmes.filter(item => !search || `${item.title} ${item.subject}`.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.page, { width: contentWidth }]}>
        <View style={styles.header}><View><Text style={styles.kicker}>THE IVYBEE LIBRARY</Text><Text style={styles.title}>Discover</Text></View><TouchableOpacity style={styles.bookmark}><Ionicons name="bookmark-outline" size={20} color={Colors.ink} /></TouchableOpacity></View>
        <View style={styles.search}><Ionicons name="search-outline" size={20} color={Colors.textMuted} /><TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="What do you want to learn?" placeholderTextColor={Colors.textMuted} /></View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map(category => <TouchableOpacity key={category} onPress={() => setActive(category)} style={[styles.category, active === category && styles.categoryActive]}><Text style={[styles.categoryText, active === category && styles.categoryTextActive]}>{category}</Text></TouchableOpacity>)}
        </ScrollView>

        <View style={styles.featured}>
          <View style={styles.featuredBadge}><Ionicons name="sparkles" size={14} color={Colors.ink} /><Text>IVYBEE PICK</Text></View>
          <Text style={styles.featuredTitle}>Study smarter,{`\n`}not longer.</Text>
          <Text style={styles.featuredText}>A five-day mini course on focus, memory and planning your week.</Text>
          <TouchableOpacity style={styles.featuredButton}><Text>Explore mini course</Text><Ionicons name="arrow-forward" size={17} color={Colors.textInverse} /></TouchableOpacity>
          <View style={styles.featuredArt}><View /><View /><View /></View>
        </View>

        <View style={styles.sectionHead}><View><Text style={styles.sectionKicker}>RECOMMENDED</Text><Text style={styles.sectionTitle}>Made for your next step</Text></View><Text style={styles.count}>{filtered.length} courses</Text></View>
        <View style={styles.cards}>
          {filtered.map(item => (
            <TouchableOpacity key={item.title} style={styles.courseCard} activeOpacity={0.82}>
              <View style={[styles.courseVisual, { backgroundColor: item.tone }]}>
                <Ionicons name={item.icon} size={35} color={item.ink} />
                <Text style={[styles.courseSubject, { color: item.ink }]}>{item.subject}</Text>
              </View>
              <View style={styles.courseCopy}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseMeta}>{item.level} · {item.lessons} lessons</Text>
                {item.progress > 0 ? <View style={styles.courseProgress}><View style={[styles.courseFill, { width: `${item.progress}%` }]} /><Text>{item.progress}%</Text></View> : <Text style={styles.courseAction}>View course  →</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  bookmark: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.paper },
  search: { height: 52, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: Colors.paper },
  searchInput: { flex: 1, color: Colors.ink, fontSize: 13 },
  categories: { paddingVertical: 14, gap: 8 },
  category: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.full, backgroundColor: Colors.paper },
  categoryActive: { backgroundColor: Colors.ink },
  categoryText: { color: Colors.textSecondary, fontSize: 10, fontWeight: FontWeight.bold },
  categoryTextActive: { color: Colors.primary },
  featured: { minHeight: 245, padding: 20, overflow: 'hidden', borderRadius: Radius.xl, backgroundColor: Colors.primary },
  featuredBadge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,.42)' },
  featuredTitle: { marginTop: 21, color: Colors.ink, fontSize: 31, lineHeight: 33, fontWeight: FontWeight.extrabold, letterSpacing: -1.2 },
  featuredText: { marginTop: 8, maxWidth: 260, color: '#604C13', fontSize: 10, lineHeight: 15 },
  featuredButton: { width: 170, height: 42, marginTop: 16, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, backgroundColor: Colors.ink },
  featuredArt: { position: 'absolute', right: -26, bottom: -18, width: 138, height: 138, borderRadius: 69, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.25)' },
  sectionHead: { marginTop: 27, marginBottom: 11, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionKicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.2 },
  sectionTitle: { marginTop: 3, color: Colors.ink, fontSize: 22, fontWeight: FontWeight.extrabold, letterSpacing: -.6 },
  count: { color: Colors.textMuted, fontSize: 9 },
  cards: { gap: 10 },
  courseCard: { minHeight: 128, flexDirection: 'row', overflow: 'hidden', borderRadius: Radius.lg, backgroundColor: Colors.paper },
  courseVisual: { width: 112, padding: 13, justifyContent: 'space-between' },
  courseSubject: { fontSize: 7, fontWeight: FontWeight.extrabold, letterSpacing: .8 },
  courseCopy: { flex: 1, padding: 14, justifyContent: 'center' },
  courseTitle: { color: Colors.ink, fontSize: 15, lineHeight: 19, fontWeight: FontWeight.extrabold },
  courseMeta: { marginTop: 5, color: Colors.textMuted, fontSize: 9 },
  courseAction: { marginTop: 13, color: Colors.goldDark, fontSize: 10, fontWeight: FontWeight.bold },
  courseProgress: { marginTop: 14, height: 7, overflow: 'hidden', borderRadius: 7, backgroundColor: '#E9E5DA' },
  courseFill: { height: '100%', borderRadius: 7, backgroundColor: Colors.primaryMid },
});
