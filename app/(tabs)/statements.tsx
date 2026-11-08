import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { api, LearnerStatement, ParentChild } from '../../services/api';

const money = (value: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
const date = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
const iso = (value: Date) => value.toISOString().slice(0, 10);
const htmlEscape = (value?: string) => (value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c]!));

export default function StatementsScreen() {
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [selectedId, setSelectedId] = useState(0);
  const [statement, setStatement] = useState<LearnerStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const now = new Date();
  const from = `${now.getFullYear()}-01-01`;
  const to = iso(now);
  const load = useCallback(async () => {
    setError('');
    try { const rows = await api.getChildren(); setChildren(rows); if (rows[0]) setSelectedId(current => current || rows[0].id); }
    catch (caught: any) { setError(caught.message ?? 'Could not load your children.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const generate = async () => {
    if (!selectedId) return;
    setLoading(true); setError('');
    try { setStatement(await api.getStatement(selectedId, from, to)); }
    catch (caught: any) { setError(caught.message ?? 'Could not generate this statement.'); }
    finally { setLoading(false); }
  };
  const exportPdf = async () => {
    if (!statement) return;
    setExporting(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: statementHtml(statement) });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `${statement.studentName} statement` });
      else Alert.alert('Statement created', uri);
    } catch (caught: any) { Alert.alert('Could not export statement', caught.message); }
    finally { setExporting(false); }
  };

  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page}>
    <TouchableOpacity style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={20} color={Colors.ink} /><Text>Payments</Text></TouchableOpacity>
    <Text style={styles.kicker}>FAMILY FINANCE</Text><Text style={styles.title}>Learner statement</Text><Text style={styles.intro}>Generate a school-branded statement for the current year.</Text>
    <Text style={styles.label}>CHOOSE LEARNER</Text><View style={styles.children}>{children.map(child => <TouchableOpacity key={child.id} style={[styles.child, selectedId===child.id&&styles.childSelected]} onPress={() => { setSelectedId(child.id); setStatement(null); }}><View style={styles.avatar}><Text>{child.firstName[0]}{child.lastName[0]}</Text></View><Text style={styles.childName}>{child.firstName} {child.lastName}</Text><Ionicons name={selectedId===child.id?'checkmark-circle':'ellipse-outline'} size={22} color={selectedId===child.id?Colors.success:Colors.textMuted}/></TouchableOpacity>)}</View>
    <TouchableOpacity style={styles.generate} disabled={!selectedId||loading} onPress={generate}><Text style={styles.generateText}>{loading?'Generating…':'Generate current-year statement'}</Text></TouchableOpacity>
    {loading ? <ActivityIndicator style={styles.loader} color={Colors.goldDark}/> : null}{error ? <Text style={styles.error}>{error}</Text> : null}
    {statement ? <View style={styles.sheet}><View style={styles.sheetTop}><View><Text style={styles.school}>{statement.school.schoolName}</Text><Text style={styles.number}>{statement.statementNumber}</Text></View><Text style={styles.balance}>{money(statement.closingBalance)}</Text></View><View style={styles.party}><Text style={styles.partyLabel}>STATEMENT FOR</Text><Text style={styles.partyName}>{statement.studentName}</Text><Text style={styles.partyMeta}>{statement.studentNumber} · {statement.guardianName}</Text><Text style={styles.partyMeta}>{date(statement.from)} – {date(statement.to)}</Text></View><View style={styles.lines}><Line label="Opening balance" value={money(statement.openingBalance)}/>{statement.entries.map((line,index)=><Line key={`${line.date}-${index}`} label={`${date(line.date)} · ${line.description}`} value={line.credit>0?`-${money(line.credit)}`:money(line.debit)} muted={line.credit>0}/>)}</View><View style={styles.total}><Text>Closing balance</Text><Text>{money(statement.closingBalance)}</Text></View><TouchableOpacity style={styles.export} disabled={exporting} onPress={exportPdf}><Ionicons name="document-text-outline" size={19} color={Colors.ink}/><Text style={styles.exportText}>{exporting?'Creating PDF…':'Save or share PDF'}</Text></TouchableOpacity></View> : null}
  </ScrollView></SafeAreaView>;
}

function Line({label,value,muted}:{label:string;value:string;muted?:boolean}){return <View style={styles.line}><Text style={styles.lineLabel}>{label}</Text><Text style={[styles.lineValue,muted&&styles.credit]}>{value}</Text></View>}

function statementHtml(s:LearnerStatement){const rows=s.entries.map(x=>`<tr><td>${date(x.date)}</td><td>${htmlEscape(x.description)}</td><td>${htmlEscape(x.reference)}</td><td>${x.debit?money(x.debit):''}</td><td>${x.credit?money(x.credit):''}</td><td>${money(x.balance)}</td></tr>`).join('');return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#241b30;padding:34px}header{display:flex;justify-content:space-between;border-bottom:4px solid #5b21b6;padding-bottom:18px}header img{max-width:90px;max-height:75px}h1{font-size:22px;margin:0}.muted{color:#746d7e;font-size:12px}.title{text-align:right;color:#5b21b6;font-weight:800}.party{display:flex;justify-content:space-between;padding:20px 0}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#f1ecf8;text-align:left;padding:9px}td{padding:9px;border-bottom:1px solid #e4ddec}th:nth-last-child(-n+3),td:nth-last-child(-n+3){text-align:right}.summary{margin-left:auto;margin-top:20px;width:300px}.summary div{display:flex;justify-content:space-between;padding:10px;border:1px solid #ddd}.balance{background:#5b21b6;color:#fff;font-weight:800}footer{margin-top:30px;border-top:1px solid #ddd;padding-top:15px;font-size:11px;white-space:pre-line}</style></head><body><header><div>${s.school.logoUrl?`<img src="${htmlEscape(s.school.logoUrl)}">`:''}<h1>${htmlEscape(s.school.schoolName)}</h1><div class="muted">${htmlEscape(s.school.address)}<br>${htmlEscape(s.school.phone)} · ${htmlEscape(s.school.email)}</div></div><div class="title">LEARNER STATEMENT<br><span class="muted">${htmlEscape(s.statementNumber)}</span></div></header><div class="party"><div><b>${htmlEscape(s.studentName)}</b><div class="muted">${htmlEscape(s.studentNumber)}</div></div><div><b>${htmlEscape(s.guardianName)}</b><div class="muted">${htmlEscape(s.guardianEmail)}</div></div><div><b>${date(s.from)} – ${date(s.to)}</b></div></div><table><thead><tr><th>Date</th><th>Description</th><th>Reference</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead><tbody><tr><td>${date(s.from)}</td><td>Opening balance</td><td></td><td></td><td></td><td>${money(s.openingBalance)}</td></tr>${rows}</tbody></table><div class="summary"><div><span>Total charges</span><b>${money(s.totalCharges)}</b></div><div><span>Total payments</span><b>${money(s.totalPayments)}</b></div><div class="balance"><span>Closing balance</span><b>${money(s.closingBalance)}</b></div></div>${s.school.bankingDetails?`<footer><b>Banking details</b><br>${htmlEscape(s.school.bankingDetails)}</footer>`:''}<footer>${htmlEscape(s.school.documentFooter||"Thank you.")}</footer></body></html>`}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:Colors.background},page:{width:'100%',maxWidth:560,alignSelf:'center',padding:18,paddingBottom:40},back:{marginTop:8,flexDirection:'row',alignItems:'center',gap:7},kicker:{marginTop:22,color:Colors.goldDark,fontSize:9,fontWeight:FontWeight.extrabold,letterSpacing:1.4},title:{marginTop:6,color:Colors.ink,fontFamily:Typography.display,fontSize:34,fontWeight:FontWeight.extrabold,letterSpacing:-1.2},intro:{marginTop:7,color:Colors.textSecondary,fontSize:13},label:{marginTop:24,marginBottom:8,color:Colors.textMuted,fontSize:9,fontWeight:FontWeight.extrabold,letterSpacing:1.1},children:{gap:8},child:{minHeight:65,padding:10,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.md,backgroundColor:Colors.paper},childSelected:{borderColor:Colors.success,backgroundColor:Colors.mintLight},avatar:{width:40,height:40,alignItems:'center',justifyContent:'center',borderRadius:13,backgroundColor:Colors.primary},childName:{flex:1,color:Colors.ink,fontSize:12,fontWeight:FontWeight.bold},generate:{height:52,marginTop:15,alignItems:'center',justifyContent:'center',borderRadius:Radius.md,backgroundColor:Colors.ink},generateText:{color:Colors.textInverse,fontWeight:FontWeight.bold},loader:{marginTop:18},error:{marginTop:15,padding:12,color:Colors.error,backgroundColor:Colors.errorLight},sheet:{marginTop:19,padding:17,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.xl,backgroundColor:Colors.paper},sheetTop:{flexDirection:'row',justifyContent:'space-between'},school:{color:Colors.ink,fontSize:15,fontWeight:FontWeight.extrabold},number:{marginTop:4,color:Colors.textMuted,fontSize:8},balance:{color:Colors.ink,fontSize:19,fontWeight:FontWeight.extrabold},party:{marginTop:17,padding:13,borderRadius:Radius.md,backgroundColor:Colors.primaryLight},partyLabel:{color:Colors.goldDark,fontSize:8,fontWeight:FontWeight.extrabold},partyName:{marginTop:4,color:Colors.ink,fontSize:14,fontWeight:FontWeight.extrabold},partyMeta:{marginTop:3,color:Colors.textSecondary,fontSize:9},lines:{marginTop:12},line:{paddingVertical:9,flexDirection:'row',gap:8,borderBottomWidth:1,borderBottomColor:Colors.border},lineLabel:{flex:1,color:Colors.textSecondary,fontSize:9},lineValue:{color:Colors.ink,fontSize:10,fontWeight:FontWeight.bold},credit:{color:Colors.success},total:{marginTop:14,padding:14,flexDirection:'row',justifyContent:'space-between',borderRadius:Radius.md,backgroundColor:Colors.ink},export:{height:50,marginTop:12,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,borderRadius:Radius.md,backgroundColor:Colors.primary},exportText:{color:Colors.ink,fontWeight:FontWeight.bold}});
