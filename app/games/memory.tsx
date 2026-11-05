import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';

type Card = { id: number; pair: number; symbol: string; matched: boolean };
const symbols = ['🐝', '🌻', '🦋', '🍎', '🌈', '⭐'];

function newDeck(): Card[] {
  const deck = symbols.flatMap((symbol, pair) => [0, 1].map(offset => ({ id: pair * 2 + offset, pair, symbol, matched: false })));
  for (let index = deck.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[target]] = [deck[target], deck[index]];
  }
  return deck;
}

export default function MemoryGameScreen() {
  const [cards, setCards] = useState<Card[]>(newDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const complete = cards.every(card => card.matched);

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open.map(id => cards.find(card => card.id === id)!);
    const timer = setTimeout(() => {
      if (first.pair === second.pair) setCards(current => current.map(card => card.pair === first.pair ? { ...card, matched: true } : card));
      setOpen([]);
    }, 650);
    return () => clearTimeout(timer);
  }, [open, cards]);

  const flip = (card: Card) => {
    if (card.matched || open.includes(card.id) || open.length === 2) return;
    setOpen(current => [...current, card.id]);
    if (open.length === 1) setMoves(value => value + 1);
  };

  const reset = () => { setCards(newDeck()); setOpen([]); setMoves(0); };

  return <SafeAreaView style={styles.safe}><View style={styles.page}>
    <View style={styles.header}><TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={21} color={Colors.ink} /></TouchableOpacity><View><Text style={styles.kicker}>MATCH THE PAIRS</Text><Text style={styles.title}>Memory cards</Text></View></View>
    <View style={styles.status}><Text>Moves <Text style={styles.bold}>{moves}</Text></Text><TouchableOpacity onPress={reset}><Ionicons name="refresh" size={18} color={Colors.goldDark} /><Text>New game</Text></TouchableOpacity></View>
    <View style={styles.grid}>{cards.map(card => {
      const visible = card.matched || open.includes(card.id);
      return <TouchableOpacity key={card.id} style={[styles.card, visible && styles.cardOpen, card.matched && styles.cardMatched]} onPress={() => flip(card)} activeOpacity={.82}><Text style={styles.symbol}>{visible ? card.symbol : '?'}</Text></TouchableOpacity>;
    })}</View>
    {complete ? <View style={styles.success}><Text style={styles.successEmoji}>🎉</Text><Text style={styles.successTitle}>You matched them all!</Text><Text>Great remembering. Finished in {moves} moves.</Text><TouchableOpacity style={styles.primary} onPress={reset}><Text>Play again</Text></TouchableOpacity></View> : <Text style={styles.tip}>Tap two cards at a time and remember where each picture lives.</Text>}
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 20 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, back: { width: 43, height: 43, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Colors.paper }, kicker: { color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.3 }, title: { color: Colors.ink, fontFamily: Typography.display, fontSize: 29, fontWeight: FontWeight.extrabold },
  status: { marginVertical: 22, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, backgroundColor: Colors.paper }, bold: { fontWeight: FontWeight.extrabold }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 9 }, card: { width: '30.5%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.lg, backgroundColor: Colors.ink }, cardOpen: { backgroundColor: Colors.primaryLight }, cardMatched: { backgroundColor: Colors.mintLight }, symbol: { color: Colors.textInverse, fontSize: 31, fontWeight: FontWeight.extrabold },
  tip: { marginTop: 20, color: Colors.textSecondary, lineHeight: 20, textAlign: 'center' }, success: { marginTop: 20, padding: 22, alignItems: 'center', borderRadius: Radius.xl, backgroundColor: Colors.paper }, successEmoji: { fontSize: 34 }, successTitle: { marginVertical: 7, color: Colors.ink, fontSize: 18, fontWeight: FontWeight.extrabold }, primary: { marginTop: 14, paddingHorizontal: 22, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.primary },
});
