import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { api, ParentPayment } from '../../services/api';

const money = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value);
const readableDate = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<ParentPayment[]>([]);
  const [selected, setSelected] = useState<ParentPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setError(''); setPayments(await api.getPayments()); }
    catch (caught: any) { setError(caught.message ?? 'Could not load payment history.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const emailReceipt = async (payment: ParentPayment) => {
    try {
      await api.emailReceipt(payment.id);
      Alert.alert('Receipt queued', 'A copy will be sent to the email address registered with your school.');
    } catch (caught: any) { Alert.alert('Could not email receipt', caught.message); }
  };

  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.goldDark} />}>
    <Text style={styles.kicker}>FAMILY FINANCE</Text><Text style={styles.title}>Payments & receipts</Text><Text style={styles.intro}>A private history of payments recorded by your school.</Text>
    <View style={styles.summary}><View style={styles.summaryIcon}><Ionicons name="receipt-outline" size={24} color={Colors.ink} /></View><View style={styles.summaryCopy}><Text style={styles.summaryLabel}>Total shown</Text><Text style={styles.summaryValue}>{money(payments.reduce((sum, item) => sum + item.amount, 0))}</Text></View><View><Text style={styles.summaryLabel}>Receipts</Text><Text style={styles.summaryValue}>{payments.length}</Text></View></View>
    <TouchableOpacity style={styles.statementLink} onPress={() => router.push('/(tabs)/statements')}><View style={styles.statementIcon}><Ionicons name="document-text-outline" size={23} color={Colors.ink}/></View><View style={styles.copy}><Text style={styles.child}>Learner statements</Text><Text style={styles.meta}>Generate, save or share a branded PDF statement.</Text></View><Ionicons name="chevron-forward" size={20} color={Colors.textMuted}/></TouchableOpacity>
    {loading && payments.length === 0 ? <ActivityIndicator style={styles.loader} color={Colors.goldDark} /> : null}
    {error ? <TouchableOpacity style={styles.error} onPress={load}><Text>{error}</Text><Text style={styles.retry}>Tap to retry</Text></TouchableOpacity> : null}
    <View style={styles.list}>{payments.map(payment => <TouchableOpacity key={payment.id} style={styles.card} onPress={() => setSelected(payment)} activeOpacity={.84}>
      <View style={styles.paidIcon}><Ionicons name="checkmark" size={20} color={Colors.success} /></View><View style={styles.copy}><Text style={styles.child}>{payment.studentName}</Text><Text style={styles.meta}>{readableDate(payment.paidAt)} · {payment.reference}</Text><Text style={styles.receipt}>{payment.receiptNumber}</Text></View><Text style={styles.amount}>{money(payment.amount)}</Text>
    </TouchableOpacity>)}</View>
    <View style={styles.private}><Ionicons name="lock-closed-outline" size={19} color={Colors.success} /><Text style={styles.privateText}>Only you and authorised school finance staff can see these records.</Text></View>
    {selected ? <View style={styles.receiptCard}><View style={styles.receiptTop}><View style={styles.success}><Ionicons name="checkmark" size={25} color={Colors.success} /></View><TouchableOpacity onPress={() => setSelected(null)}><Ionicons name="close" size={23} color={Colors.ink} /></TouchableOpacity></View><Text style={styles.receiptKicker}>PAYMENT RECEIPT</Text><Text style={styles.receiptTitle}>Payment received</Text><Text style={styles.receiptAmount}>{money(selected.amount)}</Text><View style={styles.details}><Detail label="Child" value={selected.studentName} /><Detail label="Date" value={readableDate(selected.paidAt)} /><Detail label="Reference" value={selected.reference} /><Detail label="Receipt" value={selected.receiptNumber} /></View><TouchableOpacity style={styles.email} onPress={() => emailReceipt(selected)}><Ionicons name="mail-outline" size={19} color={Colors.ink} /><Text style={styles.emailText}>Email this receipt</Text></TouchableOpacity></View> : null}
  </ScrollView></SafeAreaView>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background }, page: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 18, paddingBottom: 36 }, kicker: { marginTop: 17, color: Colors.goldDark, fontSize: 9, fontWeight: FontWeight.extrabold, letterSpacing: 1.4 }, title: { marginTop: 6, color: Colors.ink, fontFamily: Typography.display, fontSize: 35, fontWeight: FontWeight.extrabold, letterSpacing: -1.3 }, intro: { marginTop: 7, color: Colors.textSecondary, fontSize: 13 },
  summary: { minHeight: 100, marginTop: 23, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: Radius.lg, backgroundColor: Colors.ink }, summaryIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: Colors.primary }, summaryCopy: { flex: 1 }, summaryLabel: { color: '#AAA99F', fontSize: 9 }, summaryValue: { marginTop: 4, color: Colors.textInverse, fontSize: 18, fontWeight: FontWeight.extrabold },
  loader: { marginTop: 50 }, error: { marginTop: 20, padding: 15, borderRadius: Radius.md, backgroundColor: Colors.errorLight }, retry: { marginTop: 5, color: Colors.error, fontWeight: FontWeight.bold }, list: { marginTop: 22, gap: 10 }, card: { minHeight: 93, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.paper }, paidIcon: { width: 39, height: 39, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: Colors.successLight }, copy: { flex: 1 }, child: { color: Colors.ink, fontSize: 13, fontWeight: FontWeight.extrabold }, meta: { marginTop: 4, color: Colors.textSecondary, fontSize: 9 }, receipt: { marginTop: 6, color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.bold }, amount: { color: Colors.ink, fontSize: 14, fontWeight: FontWeight.extrabold }, private: { marginTop: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: Radius.md, backgroundColor: Colors.mintLight }, privateText: { flex: 1, color: Colors.textSecondary, fontSize: 10, lineHeight: 15 },
  receiptCard: { marginTop: 18, padding: 20, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, backgroundColor: Colors.paper }, receiptTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, success: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: Colors.successLight }, receiptKicker: { marginTop: 16, color: Colors.goldDark, fontSize: 8, fontWeight: FontWeight.extrabold, letterSpacing: 1.3 }, receiptTitle: { marginTop: 5, color: Colors.ink, fontSize: 23, fontWeight: FontWeight.extrabold }, receiptAmount: { marginTop: 10, color: Colors.ink, fontSize: 32, fontWeight: FontWeight.extrabold }, details: { marginTop: 17 }, detail: { paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.border }, detailLabel: { color: Colors.textMuted, fontSize: 10 }, detailValue: { color: Colors.ink, fontSize: 10, fontWeight: FontWeight.bold }, email: { height: 51, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: Radius.md, backgroundColor: Colors.primary }, emailText: { color: Colors.ink, fontWeight: FontWeight.bold },
  statementLink:{minHeight:80,marginTop:12,padding:13,flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.lg,backgroundColor:Colors.paper},statementIcon:{width:43,height:43,alignItems:'center',justifyContent:'center',borderRadius:14,backgroundColor:Colors.primary},
});
