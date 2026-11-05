import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Dimensions,
  ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants';
import { api, Lesson } from '../../services/api';

const { width: SCREEN_W } = Dimensions.get('window');
const VIDEO_H = Math.round(SCREEN_W * (9 / 16)); // 16:9

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = Number(id);

  const videoRef = useRef<Video>(null);
  const [lesson,       setLesson]       = useState<Lesson | null>(null);
  const [courseLessons,setCourseLessons]= useState<Lesson[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [completed,    setCompleted]    = useState(false);
  const [videoStatus,  setVideoStatus]  = useState<AVPlaybackStatus | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    api.getLesson(lessonId)
      .then(l => {
        setLesson(l);
        if (l.courseId) {
          api.getLessons(l.courseId).then(setCourseLessons).catch(console.warn);
        }
      })
      .catch(err => Alert.alert('Error', err.message))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Auto-report progress when video reaches 90%
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    setVideoStatus(status);
    if (!status.isLoaded || !lesson) return;
    if (status.durationMillis && status.positionMillis) {
      const pct = (status.positionMillis / status.durationMillis) * 100;
      if (pct >= 90 && !completed) {
        setCompleted(true);
        api.updateLessonProgress(lesson.id, { watchedPercentage: Math.round(pct), completed: true })
          .catch(console.warn);
      }
    }
  }, [lesson, completed]);

  const markComplete = async () => {
    if (!lesson) return;
    try {
      await api.updateLessonProgress(lesson.id, { watchedPercentage: 100, completed: true });
      setCompleted(true);
      Alert.alert('Marked Complete! ✓', 'Great job! Keep going.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const goToLesson = (l: Lesson) => router.replace(`/lesson/${l.id}`);

  const currentIndex = courseLessons.findIndex(l => l.id === lessonId);
  const nextLesson   = currentIndex >= 0 ? courseLessons[currentIndex + 1] : null;
  const prevLesson   = currentIndex > 0  ? courseLessons[currentIndex - 1] : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <Text style={styles.errorText}>Lesson not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isVideo = lesson.contentType === 'video';
  const isText  = lesson.contentType === 'text';
  const isLive  = lesson.contentType === 'live';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <Text style={styles.headerBackText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        {isVideo && lesson.videoUrl ? (
          <View style={styles.videoWrap}>
            <Video
              ref={videoRef}
              source={{ uri: lesson.videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
          </View>
        ) : isVideo && !lesson.videoUrl ? (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderEmoji}>🎬</Text>
            <Text style={styles.videoPlaceholderText}>Video not available</Text>
          </View>
        ) : isLive ? (
          <View style={styles.liveWrap}>
            <Text style={styles.liveDot}>🔴</Text>
            <Text style={styles.liveText}>Live Lesson</Text>
            <Text style={styles.liveSubText}>Join using the link provided by your instructor.</Text>
          </View>
        ) : null}

        <View style={styles.content}>
          {/* Lesson info */}
          <View style={styles.lessonHeader}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{lesson.contentType.toUpperCase()}</Text>
            </View>
            {lesson.durationMinutes ? (
              <Text style={styles.dur}>⏱ {lesson.durationMinutes} min</Text>
            ) : null}
            {completed ? (
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>✓ Completed</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          {/* Text content */}
          {(isText || lesson.contentText) ? (
            <View style={styles.textContent}>
              <Text style={styles.contentText}>{lesson.contentText}</Text>
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actions}>
            {!completed && (
              <TouchableOpacity style={styles.markBtn} onPress={markComplete} activeOpacity={0.85}>
                <Text style={styles.markBtnText}>✓ Mark as Complete</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Navigation */}
          <View style={styles.navRow}>
            {prevLesson ? (
              <TouchableOpacity style={styles.navBtn} onPress={() => goToLesson(prevLesson)} activeOpacity={0.85}>
                <Text style={styles.navBtnLabel}>‹ Previous</Text>
                <Text style={styles.navBtnTitle} numberOfLines={1}>{prevLesson.title}</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
            {nextLesson ? (
              <TouchableOpacity style={[styles.navBtn, styles.navBtnNext]} onPress={() => goToLesson(nextLesson)} activeOpacity={0.85}>
                <Text style={[styles.navBtnLabel, styles.navBtnLabelNext]}>Next ›</Text>
                <Text style={[styles.navBtnTitle, styles.navBtnTitleNext]} numberOfLines={1}>{nextLesson.title}</Text>
              </TouchableOpacity>
            ) : <View style={{ flex: 1 }} />}
          </View>

          {/* Sidebar: course outline */}
          {courseLessons.length > 0 && (
            <View style={styles.outline}>
              <Text style={styles.outlineTitle}>Course Outline</Text>
              {courseLessons.map((l, i) => (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.outlineRow, l.id === lessonId && styles.outlineRowActive]}
                  onPress={() => goToLesson(l)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.outlineIndex, l.id === lessonId && styles.outlineIndexActive]}>
                    <Text style={[styles.outlineIndexText, l.id === lessonId && styles.outlineIndexTextActive]}>
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    style={[styles.outlineLesson, l.id === lessonId && styles.outlineLessonActive]}
                    numberOfLines={2}
                  >
                    {l.title}
                  </Text>
                  {l.durationMinutes ? (
                    <Text style={styles.outlineDur}>{l.durationMinutes}m</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: Spacing.xl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText:   { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  backBtn:     { padding: Spacing.md },
  backBtnText: { fontSize: FontSize.md, color: Colors.primary },

  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerBack:     { width: 40, height: 40, justifyContent: 'center' },
  headerBackText: { fontSize: 28, color: Colors.primary, fontWeight: FontWeight.bold },
  headerTitle:    { flex: 1, textAlign: 'center', fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary },

  videoWrap:              { width: SCREEN_W, height: VIDEO_H, backgroundColor: '#000' },
  video:                  { width: SCREEN_W, height: VIDEO_H },
  videoPlaceholder:       { width: SCREEN_W, height: VIDEO_H, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  videoPlaceholderEmoji:  { fontSize: 56, marginBottom: Spacing.sm },
  videoPlaceholderText:   { fontSize: FontSize.md, color: 'rgba(255,255,255,0.6)' },
  liveWrap:               { width: SCREEN_W, height: VIDEO_H * 0.6, backgroundColor: Colors.primaryDark, justifyContent: 'center', alignItems: 'center' },
  liveDot:                { fontSize: 48, marginBottom: Spacing.sm },
  liveText:               { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textInverse },
  liveSubText:            { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: Spacing.xs, textAlign: 'center', paddingHorizontal: Spacing.lg },

  content:       { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  lessonHeader:  { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm, flexWrap: 'wrap' },
  typeBadge:     { backgroundColor: Colors.primaryLight, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.sm },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.primaryDark },
  dur:           { fontSize: FontSize.xs, color: Colors.textMuted },
  completedBadge:     { backgroundColor: Colors.successLight, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.sm },
  completedBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.success },

  lessonTitle:  { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.lg, lineHeight: 28 },
  textContent:  { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  contentText:  { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 26 },

  actions:  { marginBottom: Spacing.lg },
  markBtn:  { height: 50, backgroundColor: Colors.primary, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  markBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textInverse },

  navRow:          { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  navBtn:          { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  navBtnNext:      { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  navBtnLabel:     { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 3 },
  navBtnLabelNext: { color: Colors.primaryDark },
  navBtnTitle:     { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  navBtnTitleNext: { color: Colors.primaryDark },

  outline:          { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  outlineTitle:     { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  outlineRow:       { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md },
  outlineRowActive: { backgroundColor: Colors.primaryLighter },
  outlineIndex:     { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.surfaceAlt, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  outlineIndexActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  outlineIndexText:       { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  outlineIndexTextActive: { color: Colors.textInverse },
  outlineLesson:       { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  outlineLessonActive: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
  outlineDur:          { fontSize: FontSize.xs, color: Colors.textMuted },
});