import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';

const puzzle = [1, 0, 0, 4, 0, 4, 1, 0, 0, 1, 4, 0, 4, 0, 0, 1];
const solution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];

export default function SudokuScreen() {
  const [board, setBoard] = useState([...puzzle]);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const complete = board.every((value, index) => value === solution[index]);
  const place = (value: number) => {
    if (selected === null || puzzle[selected] !== 0) return;
    setBoard(current => current.map((cell, index) => index === selected ? value : cell));
    setChecked(false);
  };
  const reset = () => { setBoard([...puzzle]); setSelected(null); setChecked(false); };

  return <SafeAreaView style={styles.safe}><View style={styles.page}>
    <View style={styles.header}><TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={21} color={Colors.ink} /></TouchableOpacity><View><Text style={styles.kicker}>NUMBER PUZZLE</Text><Text style={styles.title}>Mini Sudoku</Text></View></View>
    <Text style={styles.intro}>Fill each row, column and small square with the numbers 1 to 4.</Text>
    <View style={styles.board}>{board.map((value, index) => {
      const given = puzzle[index] !== 0;
      const wrong = checked && value !== 0 && value !== solution[index];
      return <TouchableOpacity key={index} style={[styles.cell, index % 4 === 1 && styles.blockRight, Math.floor(index / 4) === 1 && styles.blockBottom, selected === index && styles.selected, wrong && styles.wrong]} onPress={() => !given && setSelected(index)}><Text style={[styles.number, given && styles.given]}>{value || ''}</Text></TouchableOpacity>;
    })}</View>
    <View style={styles.options}>{[1, 2, 3, 4].map(value => <TouchableOpacity key={value} style={styles.option} onPress={() => place(value)}><Text>{value}</Text></TouchableOpacity>)}</View>
    {complete ? <View style={styles.success}><Text>🌟</Text><Text style={styles.successTitle}>Puzzle complete!</Text><TouchableOpacity style={styles.primary} onPress={reset}><Text>Play again</Text></TouchableOpacity></View> : <View style={styles.actions}><TouchableOpacity style={styles.secondary} onPress={() => selected !== null && place(0)}><Text>Clear square</Text></TouchableOpacity><TouchableOpacity style={styles.primary} onPress={() => setChecked(true)}><Text>Check answers</Text></TouchableOpacity></View>}
    {checked && !complete ? <Text style={styles.hint}>Red squares need another look. You&apos;re getting closer!</Text> : null}
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 500, alignSelf: 'center', padding: 20 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, back: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.paper }, kicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.3 }, title: { color: Colors.ink, fontFamily: Typography.display, fontSize: 29, fontWeight: FontWeight.extrabold }, intro: { marginVertical: 22, color: Colors.textSecondary, lineHeight: 20 },
  board: { width: '100%', aspectRatio: 1, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden', borderWidth: 3, borderColor: Colors.ink, borderRadius: Radius.md, backgroundColor: Colors.paper }, cell: { width: '25%', height: '25%', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: Colors.border }, blockRight: { borderRightWidth: 3, borderRightColor: Colors.ink }, blockBottom: { borderBottomWidth: 3, borderBottomColor: Colors.ink }, selected: { backgroundColor: Colors.primaryLight }, wrong: { backgroundColor: Colors.errorLight }, number: { color: Colors.ink, fontSize: 27, fontWeight: FontWeight.bold }, given: { color: Colors.goldDark, fontWeight: FontWeight.extrabold },
  options: { marginTop: 18, flexDirection: 'row', gap: 9 }, option: { flex: 1, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, backgroundColor: Colors.primary }, actions: { marginTop: 17, flexDirection: 'row', gap: 9 }, primary: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, backgroundColor: Colors.primary }, secondary: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, backgroundColor: Colors.paper }, hint: { marginTop: 14, color: Colors.error, textAlign: 'center' }, success: { marginTop: 18, padding: 20, alignItems: 'center', gap: 8, borderRadius: Radius.xl, backgroundColor: Colors.mintLight }, successTitle: { color: Colors.ink, fontSize: 18, fontWeight: FontWeight.extrabold },
});
