import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { api, CommunicationAttachment, CommunicationPost } from '../../services/api';

function readableDate(value: string) {
  return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

async function openAttachment(attachment: CommunicationAttachment) {
  if (attachment.url.includes('example.com')) {
    Alert.alert('Demo video', 'In the live school version, this opens the securely stored class video.');
    return;
  }

  const supported = await Linking.canOpenURL(attachment.url);
  if (supported) await Linking.openURL(attachment.url);
  else Alert.alert('Cannot open attachment', 'This media link is not available on this device.');
}

function Media({ attachment }: { attachment: CommunicationAttachment }) {
  if (attachment.kind === 'image') {
    return <TouchableOpacity onPress={() => openAttachment(attachment)} activeOpacity={0.9}><Image source={attachment.url} style={styles.media} contentFit="cover" transition={220} /></TouchableOpacity>;
  }

  return (
    <TouchableOpacity style={styles.video} onPress={() => openAttachment(attachment)} activeOpacity={0.88}>
      {attachment.thumbnailUrl ? <Image source={attachment.thumbnailUrl} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} /> : null}
      <View style={styles.videoShade} />
      <View style={styles.play}><Ionicons name="play" size={23} color={Colors.ink} /></View>
      <Text style={styles.videoLabel}>Play class video</Text>
    </TouchableOpacity>
  );
}

export default function GroupFeedScreen() {
  const params = useLocalSearchParams<{ id: string; name?: string; child?: string }>();
  const groupId = Number(params.id);
  const [posts, setPosts] = useState<CommunicationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!Number.isFinite(groupId)) return;
    try {
      setError('');
      setPosts(await api.getGroupPosts(groupId));
    } catch (caught: any) {
      setError(caught.message ?? 'Could not load this group.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={21} color={Colors.ink} /></TouchableOpacity>
        <View style={styles.headerCopy}><Text style={styles.headerKicker}>CLASS GROUP</Text><Text style={styles.headerTitle} numberOfLines={1}>{params.name || posts[0]?.groupName || 'School updates'}</Text></View>
        <View style={styles.private}><Ionicons name="lock-closed" size={13} color={Colors.success} /></View>
      </View>
      <ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.goldDark} />}>
        <View style={styles.notice}><Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} /><Text>Only approved guardians and school staff can view this group.</Text></View>
        <View style={styles.learning}>
          <View style={styles.learningHead}><View><Text style={styles.learningKicker}>PLAY TOGETHER</Text><Text style={styles.learningTitle}>Learning games for this class</Text></View><Ionicons name="game-controller" size={25} color={Colors.ink} /></View>
          <Text style={styles.learningCopy}>Hand the phone to your child for a quick activity. Scores are not saved.</Text>
          <View style={styles.gameRow}>
            <TouchableOpacity style={styles.gameButton} onPress={() => router.push({ pathname: '/games/memory', params: { child: params.child, group: params.name } })}><Text>🐝</Text><Text>Memory</Text></TouchableOpacity>
            <TouchableOpacity style={styles.gameButton} onPress={() => router.push({ pathname: '/games/sudoku', params: { child: params.child, group: params.name } })}><Text>🔢</Text><Text>Sudoku</Text></TouchableOpacity>
            <TouchableOpacity style={styles.gameButton} onPress={() => router.push({ pathname: '/games/math', params: { child: params.child, group: params.name } })}><Text>➕</Text><Text>Maths</Text></TouchableOpacity>
          </View>
        </View>
        {loading && posts.length === 0 ? <ActivityIndicator style={styles.loader} color={Colors.goldDark} /> : null}
        {error ? <TouchableOpacity style={styles.error} onPress={load}><Text>{error}</Text><Text style={styles.retry}>Tap to try again</Text></TouchableOpacity> : null}
        <View style={styles.feed}>
          {posts.map(post => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postHead}>
                <View style={styles.author}><Text>{post.authorName.split(' ').map(part => part[0]).slice(0, 2).join('')}</Text></View>
                <View style={styles.authorCopy}><Text style={styles.authorName}>{post.authorName}</Text><Text style={styles.meta}>{post.authorRole} · {readableDate(post.publishedAt)}</Text></View>
                {post.isPinned ? <View style={styles.pinned}><Ionicons name="pin" size={12} color={Colors.goldDark} /><Text>Pinned</Text></View> : null}
              </View>
              <Text style={styles.body}>{post.body}</Text>
              {post.attachments.map(attachment => <Media key={attachment.id} attachment={attachment} />)}
            </View>
          ))}
        </View>
        {!loading && !error && posts.length === 0 ? <View style={styles.empty}><Ionicons name="chatbubble-outline" size={30} color={Colors.textMuted} /><Text>No updates have been posted yet.</Text></View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { minHeight: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.paper },
  back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: Colors.cream },
  headerCopy: { flex: 1 }, headerKicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.2 }, headerTitle: { marginTop: 3, color: Colors.ink, fontFamily: Typography.display, fontSize: 17, fontWeight: FontWeight.extrabold },
  private: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: Colors.successLight },
  page: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 16, paddingBottom: 36 },
  notice: { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: Radius.md, backgroundColor: Colors.mintLight },
  learning: { marginTop: 13, padding: 16, borderRadius: Radius.lg, backgroundColor: Colors.primaryLight }, learningHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, learningKicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.1 }, learningTitle: { marginTop: 3, color: Colors.ink, fontSize: 15, fontWeight: FontWeight.extrabold }, learningCopy: { marginTop: 8, color: Colors.textSecondary, fontSize: 10, lineHeight: 15 }, gameRow: { marginTop: 13, flexDirection: 'row', gap: 8 }, gameButton: { flex: 1, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: Radius.md, backgroundColor: Colors.paper },
  feed: { marginTop: 14, gap: 12 }, loader: { marginTop: 60 },
  error: { marginTop: 18, padding: 16, gap: 6, borderRadius: Radius.md, backgroundColor: Colors.errorLight }, retry: { color: Colors.error, fontWeight: FontWeight.bold },
  post: { padding: 16, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.paper },
  postHead: { flexDirection: 'row', alignItems: 'center' }, author: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.primary }, authorCopy: { flex: 1, marginLeft: 10 }, authorName: { color: Colors.ink, fontSize: 13, fontWeight: FontWeight.extrabold }, meta: { marginTop: 2, color: Colors.textMuted, fontSize: 9 },
  pinned: { paddingHorizontal: 8, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, backgroundColor: Colors.primaryLight },
  body: { marginTop: 15, color: Colors.inkSoft, fontSize: 14, lineHeight: 22 },
  media: { width: '100%', height: 218, marginTop: 14, borderRadius: Radius.md, backgroundColor: Colors.surfaceAlt },
  video: { height: 218, marginTop: 14, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, backgroundColor: Colors.ink }, videoShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(23,23,19,.34)' }, play: { width: 58, height: 58, zIndex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 29, backgroundColor: Colors.primary }, videoLabel: { zIndex: 1, marginTop: 10, color: Colors.textInverse, fontWeight: FontWeight.bold },
  empty: { marginTop: 26, padding: 32, alignItems: 'center', gap: 8, borderRadius: Radius.lg, backgroundColor: Colors.paper },
});
