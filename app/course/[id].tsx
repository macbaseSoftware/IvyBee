// ─────────────────────────────────────────────────────────────────────────────
//  app/course/[id].tsx  — Course Detail Screen
//
//  Dynamic route — the [id] in the filename becomes a route parameter.
//  In Expo Router:
//    /course/42  →  this file renders, with useLocalSearchParams() returning { id: '42' }
//
//  This is equivalent to Next.js app/course/[id]/page.tsx
//
//  New RN concepts:
//    • useLocalSearchParams()  — reads URL params (like useParams() in Next.js)
//    • Animated  — React Native's built-in animation API
//    • ScrollView with stickyHeaderIndices — makes a specific child "stick" 
//      to the top when scrolled past (like position: sticky in CSS)
// ─────────────────────────────────────────────────────────────────────────────
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  Image,
  ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants';
import { api, Course, Enrollment, Lesson } from '../../services/api';

const CONTENT_ICONS: Record<string, string> = {
  video:      '▶',
  text:       '📄',
  quiz:       '✏️',
  attachment: '📎',
  live:       '🔴',
};

function LessonRow({
  lesson, index, enrolled, onPress,
}: {
  lesson: Lesson; index: number; enrolled: boolean; onPress: () => void;
}) {
  const icon = CONTENT_ICONS[lesson.contentType] ?? '📄';
  const dur  = lesson.durationMinutes ? `${lesson.durationMinutes} min` : '';
  const canAccess = enrolled || lesson.isFreePreview;

  return (
    <TouchableOpacity
      style={[styles.lessonRow, !canAccess && styles.lessonRowLocked]}
      onPress={canAccess ? onPress : () => Alert.alert('Enroll Required', 'Enroll in this course to access this lesson.')}
      activeOpacity={0.75}
    >
      <View style={styles.lessonIndex}>
        <Text style={styles.lessonIndexText}>{index + 1}</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
        <View style={styles.lessonMeta}>
          <Text style={styles.lessonType}>{icon} {lesson.contentType}</Text>
          {dur ? <Text style={styles.lessonDur}>· {dur}</Text> : null}
          {lesson.isFreePreview ? (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          ) : null}
        </View>
      </View>
      <Text style={styles.lessonChevron}>{canAccess ? '›' : '🔒'}</Text>
    </TouchableOpacity>
  );
}

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const courseId = Number(id);

  const [course,     setCourse]     = useState<Course | null>(null);
  const [lessons,    setLessons]    = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [enrolling,  setEnrolling]  = useState(false);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      api.getCourse(courseId).then(setCourse).catch(console.warn),
      api.getLessons(courseId).then(setLessons).catch(console.warn),
      api.getMyEnrollments().then(list => {
        const found = list.find(e => e.courseId === courseId);
        if (found) setEnrollment(found);
      }).catch(console.warn),
    ]).finally(() => setLoading(false));
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const e = await api.enroll(courseId);
      setEnrollment(e);
      Alert.alert('Enrolled!', 'You are now enrolled in this course.');
    } catch (err: any) {
      Alert.alert('Enrollment Failed', err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <Text style={styles.errorText}>Course not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const price    = course.price === 0 ? 'Free' : course.price ? `R${course.price}` : 'Free';
  const duration = course.durationWeeks ? `${course.durationWeeks} week${course.durationWeeks > 1 ? 's' : ''}` : null;
  const enrolled = enrollment !== null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Text style={styles.headerBackText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Course Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Thumbnail */}
        <View style={styles.thumbWrap}>
          {course.thumbnailUrl ? (
            <Image source={{ uri: course.thumbnailUrl }} style={styles.thumb} resizeMode="cover" />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Text style={styles.thumbEmoji}>📚</Text>
            </View>
          )}
          {/* Gradient overlay */}
          <View style={styles.thumbOverlay} />
          {/* Price badge */}
          <View style={[styles.priceBadge, course.price === 0 ? styles.priceFree : styles.pricePaid]}>
            <Text style={styles.priceBadgeText}>{price}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title + org */}
          <Text style={styles.title}>{course.title}</Text>
          {course.organization && (
            <Text style={styles.orgName}>by {course.organization.name}</Text>
          )}

          {/* Meta pills */}
          <View style={styles.metaRow}>
            {course.language && (
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>🌐 {course.language}</Text>
              </View>
            )}
            {duration && (
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>⏱ {duration}</Text>
              </View>
            )}
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>📖 {lessons.length} lessons</Text>
            </View>
            {enrolled && (
              <View style={[styles.metaPill, styles.metaPillGreen]}>
                <Text style={[styles.metaPillText, styles.metaPillTextGreen]}>✓ Enrolled</Text>
              </View>
            )}
          </View>

          {/* Short description */}
          {course.shortDescription ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this course</Text>
              <Text style={styles.bodyText}>{course.shortDescription}</Text>
            </View>
          ) : null}

          {/* Full description */}
          {course.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{course.description}</Text>
            </View>
          ) : null}

          {/* Instructors */}
          {course.instructors && course.instructors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructors</Text>
              {course.instructors.map((ci, i) => (
                <View key={i} style={styles.instructorRow}>
                  <View style={styles.instructorAvatar}>
                    <Text style={styles.instructorAvatarText}>
                      {(ci.user?.firstName?.[0] ?? ci.user?.email?.[0] ?? 'I').toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.instructorName}>
                      {ci.user?.firstName} {ci.user?.lastName}
                    </Text>
                    <Text style={styles.instructorRole}>{ci.role.replace('_', ' ')}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Organization */}
          {course.organization && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Offered by</Text>
              <View style={styles.orgCard}>
                {course.organization.logoUrl ? (
                  <Image source={{ uri: course.organization.logoUrl }} style={styles.orgLogo} />
                ) : (
                  <View style={styles.orgLogoPlaceholder}>
                    <Text style={styles.orgLogoText}>
                      {course.organization.name[0].toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.orgInfo}>
                  <Text style={styles.orgCardName}>{course.organization.name}</Text>
                  {course.organization.description ? (
                    <Text style={styles.orgCardDesc} numberOfLines={2}>
                      {course.organization.description}
                    </Text>
                  ) : null}
                  {course.organization.website ? (
                    <Text style={styles.orgWebsite}>{course.organization.website}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          )}

          {/* Lessons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            <Text style={styles.lessonCount}>{lessons.length} lessons</Text>
            {lessons.length === 0 ? (
              <View style={styles.emptyLessons}>
                <Text style={styles.emptyLessonsText}>No lessons yet.</Text>
              </View>
            ) : (
              <View style={styles.lessonList}>
                {lessons.map((lesson, i) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    index={i}
                    enrolled={enrolled}
                    onPress={() => router.push(`/lesson/${lesson.id}`)}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.stickyBottom}>
        {enrolled ? (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => {
              const first = lessons[0];
              if (first) router.push(`/lesson/${first.id}`);
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.continueBtnText}>
              {lessons.length > 0 ? 'Continue Learning →' : 'Go to Course'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.enrollBtn, enrolling && styles.enrollBtnDisabled]}
            onPress={handleEnroll}
            disabled={enrolling}
            activeOpacity={0.9}
          >
            {enrolling ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.enrollBtnText}>
                {course.price === 0 ? 'Enroll for Free' : `Enroll — ${price}`}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  loadingWrap:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText:      { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerBack:     { width: 40, height: 40, justifyContent: 'center' },
  headerBackText: { fontSize: 28, color: Colors.primary, fontWeight: FontWeight.bold },
  headerTitle:    { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  backBtn:        { marginTop: Spacing.md, padding: Spacing.md },
  backBtnText:    { fontSize: FontSize.md, color: Colors.primary },

  thumbWrap:        { height: 220, position: 'relative' },
  thumb:            { width: '100%', height: '100%' },
  thumbPlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  thumbEmoji:       { fontSize: 72 },
  thumbOverlay:     { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: 'transparent' },
  priceBadge:       { position: 'absolute', top: Spacing.md, right: Spacing.md, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  priceFree:        { backgroundColor: Colors.primary },
  pricePaid:        { backgroundColor: Colors.accent },
  priceBadgeText:   { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textInverse },

  content:       { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  title:         { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.xs, lineHeight: 30 },
  orgName:       { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold, marginBottom: Spacing.md },

  metaRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.lg },
  metaPill:          { backgroundColor: Colors.surfaceAlt, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  metaPillGreen:     { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  metaPillText:      { fontSize: FontSize.xs, color: Colors.textSecondary },
  metaPillTextGreen: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },

  section:      { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  bodyText:     { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24 },
  lessonCount:  { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.md },

  instructorRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.md },
  instructorAvatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  instructorAvatarText:{ fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textInverse },
  instructorName:      { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  instructorRole:      { fontSize: FontSize.sm, color: Colors.textMuted, textTransform: 'capitalize' },

  orgCard:            { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  orgLogo:            { width: 56, height: 56, borderRadius: Radius.md },
  orgLogoPlaceholder: { width: 56, height: 56, borderRadius: Radius.md, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  orgLogoText:        { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary },
  orgInfo:            { flex: 1 },
  orgCardName:        { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  orgCardDesc:        { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  orgWebsite:         { fontSize: FontSize.xs, color: Colors.info, marginTop: 4 },

  lessonList:       { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  lessonRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md },
  lessonRowLocked:  { opacity: 0.55 },
  lessonIndex:      { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  lessonIndexText:  { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primary },
  lessonInfo:       { flex: 1 },
  lessonTitle:      { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 3 },
  lessonMeta:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  lessonType:       { fontSize: FontSize.xs, color: Colors.textMuted, textTransform: 'capitalize' },
  lessonDur:        { fontSize: FontSize.xs, color: Colors.textMuted },
  lessonChevron:    { fontSize: FontSize.lg, color: Colors.textMuted },
  freeBadge:        { backgroundColor: Colors.primaryLight, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  freeBadgeText:    { fontSize: 9, fontWeight: FontWeight.bold, color: Colors.primary },
  emptyLessons:     { padding: Spacing.lg, alignItems: 'center' },
  emptyLessonsText: { fontSize: FontSize.md, color: Colors.textMuted },

  stickyBottom:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, paddingBottom: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.border, shadowColor: Colors.shadowDark, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 8 },
  enrollBtn:         { height: 54, backgroundColor: Colors.primary, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  enrollBtnDisabled: { opacity: 0.6 },
  enrollBtnText:     { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textInverse, letterSpacing: 0.3 },
  continueBtn:       { height: 54, backgroundColor: Colors.primaryDark, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  continueBtnText:   { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textInverse },
});