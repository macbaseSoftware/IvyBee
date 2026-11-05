import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';

type Question = { left: number; right: number; answer: number; choices: number[] };
function makeQuestion(): Question {
  const left = Math.floor(Math.random() * 9) + 1;
  const right = Math.floor(Math.random() * 9) + 1;
  const answer = left + right;
  const values = new Set([answer]);
  while (values.size < 4) values.add(Math.max(1, answer + Math.floor(Math.random() * 7) - 3));
  const choices = [...values];
  for (let index = choices.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[target]] = [choices[target], choices[index]];
  }
  return { left, right, answer, choices };
}

export default function MathGameScreen() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(makeQuestion);
  const [choice, setChoice] = useState<number | null>(null);
  const finished = round > 10;
  const choose = (value: number) => {
    if (choice !== null) return;
    setChoice(value);
    if (value === question.answer) setScore(current => current + 1);
  };
  const next = () => { setRound(current => current + 1); setQuestion(makeQuestion()); setChoice(null); };
  const reset = () => { setRound(1); setScore(0); setQuestion(makeQuestion()); setChoice(null); };

  return <SafeAreaView style={styles.safe}><View style={styles.page}>
    <View style={styles.header}><TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={21} color={Colors.ink} /></TouchableOpacity><View><Text style={styles.kicker}>10 QUICK ROUNDS</Text><Text style={styles.title}>Quick maths</Text></View></View>
    {!finished ? <>
      <View style={styles.progress}><View style={[styles.progressFill, { width: `${round * 10}%` }]} /></View>
      <View style={styles.meta}><Text>Question {round} of 10</Text><Text>Score {score}</Text></View>
      <View style={styles.question}><Text>{question.left} + {question.right}</Text><Text style={styles.equals}>= ?</Text></View>
      <View style={styles.choices}>{question.choices.map(value => {
        const correct = choice !== null && value === question.answer;
        const wrong = choice === value && value !== question.answer;
        return <TouchableOpacity key={value} style={[styles.choice, correct && styles.correct, wrong && styles.wrong]} onPress={() => choose(value)}><Text>{value}</Text></TouchableOpacity>;
      })}</View>
      {choice !== null ? <View style={styles.feedback}><Text style={styles.feedbackTitle}>{choice === question.answer ? 'Brilliant! 🎉' : `Good try — it’s ${question.answer}.`}</Text><TouchableOpacity style={styles.primary} onPress={next}><Text>{round === 10 ? 'See my score' : 'Next question'}</Text><Ionicons name="arrow-forward" size={18} color={Colors.ink} /></TouchableOpacity></View> : <Text style={styles.tip}>Tap the correct answer.</Text>}
    </> : <View style={styles.finish}><Text style={styles.trophy}>🏆</Text><Text style={styles.finishTitle}>You scored {score} out of 10!</Text><Text>{score >= 8 ? 'Fantastic number work!' : 'Nice effort—practice makes progress.'}</Text><TouchableOpacity style={styles.primary} onPress={reset}><Text>Play another round</Text></TouchableOpacity></View>}
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 500, alignSelf: 'center', padding: 20 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, back: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.paper }, kicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.3 }, title: { color: Colors.ink, fontFamily: Typography.display, fontSize: 29, fontWeight: FontWeight.extrabold },
  progress: { height: 8, marginTop: 28, overflow: 'hidden', borderRadius: 4, backgroundColor: Colors.surfaceAlt }, progressFill: { height: '100%', backgroundColor: Colors.primary }, meta: { marginTop: 9, flexDirection: 'row', justifyContent: 'space-between' }, question: { marginVertical: 28, padding: 28, alignItems: 'center', borderRadius: Radius.xl, backgroundColor: Colors.ink }, equals: { marginTop: 5, color: Colors.primary, fontSize: 28, fontWeight: FontWeight.extrabold },
  choices: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }, choice: { width: '47%', height: 72, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.paper }, correct: { borderColor: Colors.success, backgroundColor: Colors.successLight }, wrong: { borderColor: Colors.error, backgroundColor: Colors.errorLight },
  tip: { marginTop: 20, color: Colors.textSecondary, textAlign: 'center' }, feedback: { marginTop: 20, alignItems: 'center', gap: 13 }, feedbackTitle: { color: Colors.ink, fontSize: 17, fontWeight: FontWeight.extrabold }, primary: { minHeight: 50, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, backgroundColor: Colors.primary }, finish: { marginTop: 50, padding: 28, alignItems: 'center', gap: 9, borderRadius: Radius.xl, backgroundColor: Colors.paper }, trophy: { fontSize: 50 }, finishTitle: { color: Colors.ink, fontSize: 22, fontWeight: FontWeight.extrabold },
});
