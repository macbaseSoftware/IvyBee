import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { useAuth } from '../../store/authStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const games: { route: '/games/memory' | '/games/sudoku' | '/games/math'; icon: IconName; title: string; copy: string; tone: string }[] = [
  { route: '/games/memory', icon: 'copy-outline', title: 'Memory cards', copy: 'Match all six picture pairs.', tone: Colors.lilacLight },
  { route: '/games/sudoku', icon: 'grid-outline', title: 'Mini Sudoku', copy: 'Complete a friendly 4 × 4 number grid.', tone: Colors.skyLight },
  { route: '/games/math', icon: 'add-circle-outline', title: 'Quick maths', copy: 'Answer 10 cheerful addition questions.', tone: Colors.primaryLight },
];

export default function GamesHubScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ child?: string; group?: string }>();
  const context = params.child
    ? `Choose an activity for ${params.child}${params.group ? ` from ${params.group}` : ''}.`
    : 'Choose a quick game. Progress stays on this device and is not saved.';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}>
            <Ionicons name="arrow-back" size={21} color={Colors.ink} />
          </TouchableOpacity>
          <View style={styles.headerCopy}><Text style={styles.kicker}>{user ? 'PLAY & LEARN' : 'GUEST PLAY'}</Text><Text style={styles.title}>Learning games</Text></View>
        </View>
        <View style={styles.hero}><Ionicons name="game-controller" size={32} color={Colors.ink} /><Text>{context}</Text></View>
        <View style={styles.list}>
          {games.map(game => (
            <TouchableOpacity key={game.route} style={styles.card} onPress={() => router.push({ pathname: game.route, params })} activeOpacity={.84}>
              <View style={[styles.icon, { backgroundColor: game.tone }]}><Ionicons name={game.icon} size={27} color={Colors.ink} /></View>
              <View style={styles.copy}><Text style={styles.gameTitle}>{game.title}</Text><Text style={styles.gameCopy}>{game.copy}</Text></View>
              <Ionicons name="chevron-forward" size={21} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        {!user ? <TouchableOpacity style={styles.signIn} onPress={() => router.replace('/(auth)/login')}><Text>Sign in for family updates</Text><Ionicons name="log-in-outline" size={18} color={Colors.ink} /></TouchableOpacity> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 20, paddingBottom: 40 },
  header: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }, back: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.paper }, headerCopy: { flex: 1 },
  kicker: { color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.4 }, title: { marginTop: 3, color: Colors.ink, fontFamily: Typography.display, fontSize: 31, fontWeight: FontWeight.extrabold, letterSpacing: -1.2 },
  hero: { marginTop: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: Radius.xl, backgroundColor: Colors.primary },
  list: { marginTop: 20, gap: 11 }, card: { minHeight: 94, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.paper }, icon: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 17 }, copy: { flex: 1 }, gameTitle: { color: Colors.ink, fontSize: 15, fontWeight: FontWeight.extrabold }, gameCopy: { marginTop: 4, color: Colors.textSecondary, fontSize: 11, lineHeight: 16 },
  signIn: { height: 52, marginTop: 22, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, backgroundColor: Colors.primary },
});
