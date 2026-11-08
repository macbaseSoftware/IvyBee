import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontWeight, Radius, Typography } from '../../constants';
import { api, AuthorizedCollector, CollectionEvent } from '../../services/api';

const time = (value: string) => new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
const initials = (value: string) => value.split(' ').filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('');

export default function SafetyScreen() {
  const [collectors, setCollectors] = useState<AuthorizedCollector[]>([]);
  const [events, setEvents] = useState<CollectionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try { const [people, history] = await Promise.all([api.getCollectors(), api.getCollections()]); setCollectors(people); setEvents(history); }
    catch (caught: any) { setError(caught.message ?? 'Could not load collection safety information.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.goldDark} />}>
    <Text style={styles.kicker}>CHILD SAFETY</Text><Text style={styles.title}>Collection</Text><Text style={styles.intro}>People currently approved by your school to collect your children.</Text>
    {loading && collectors.length === 0 ? <ActivityIndicator style={styles.loader} color={Colors.goldDark} /> : null}
    {error ? <TouchableOpacity style={styles.error} onPress={load}><Text>{error}</Text><Text style={styles.retry}>Tap to retry</Text></TouchableOpacity> : null}
    <Text style={styles.section}>APPROVED COLLECTORS</Text>
    <View style={styles.list}>{collectors.map(person => <View key={person.id} style={styles.person}>
      {person.photoUrl ? <Image source={{ uri: person.photoUrl }} style={styles.photo} /> : <View style={styles.avatar}><Text style={styles.avatarText}>{initials(person.fullName)}</Text></View>}
      <View style={styles.copy}><Text style={styles.name}>{person.fullName}</Text><Text style={styles.meta}>{person.relationship}{person.phone ? ` · ${person.phone}` : ''}</Text><Text style={styles.children}>{person.children.map(x => x.name).join(', ')}</Text>{person.identificationLabel ? <Text style={styles.id}>{person.identificationLabel}</Text> : null}</View>
      <Ionicons name="shield-checkmark" size={22} color={Colors.success} />
    </View>)}</View>
    <Text style={styles.section}>RECENT COLLECTIONS</Text>
    <View style={styles.list}>{events.slice(0, 20).map(item => <View key={item.id} style={styles.event}><View style={styles.check}><Ionicons name="checkmark" size={18} color={Colors.success} /></View><View style={styles.copy}><Text style={styles.name}>{item.studentName}</Text><Text style={styles.meta}>Collected by {item.collectorName} · {item.collectorRelationship}</Text><Text style={styles.children}>{time(item.collectedAt)} · Approved by {item.authorizedBy}</Text></View>{item.isLate ? <Text style={styles.late}>LATE</Text> : null}</View>)}</View>
    <View style={styles.private}><Ionicons name="lock-closed-outline" size={19} color={Colors.success} /><Text style={styles.privateText}>Identification images remain restricted to authorised school staff.</Text></View>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:Colors.background},page:{width:'100%',maxWidth:560,alignSelf:'center',padding:18,paddingBottom:38},kicker:{marginTop:17,color:Colors.goldDark,fontSize:9,fontWeight:FontWeight.extrabold,letterSpacing:1.4},title:{marginTop:6,color:Colors.ink,fontFamily:Typography.display,fontSize:35,fontWeight:FontWeight.extrabold,letterSpacing:-1.3},intro:{marginTop:7,color:Colors.textSecondary,fontSize:13,lineHeight:20},loader:{marginTop:45},error:{marginTop:20,padding:15,borderRadius:Radius.md,backgroundColor:Colors.errorLight},retry:{marginTop:5,color:Colors.error,fontWeight:FontWeight.bold},section:{marginTop:25,marginBottom:9,color:Colors.textMuted,fontSize:9,fontWeight:FontWeight.extrabold,letterSpacing:1.1},list:{gap:10},person:{minHeight:102,padding:13,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.lg,backgroundColor:Colors.paper},photo:{width:64,height:64,borderRadius:20},avatar:{width:64,height:64,alignItems:'center',justifyContent:'center',borderRadius:20,backgroundColor:Colors.primaryLight},avatarText:{color:Colors.ink,fontSize:18,fontWeight:FontWeight.extrabold},copy:{flex:1},name:{color:Colors.ink,fontSize:13,fontWeight:FontWeight.extrabold},meta:{marginTop:3,color:Colors.textSecondary,fontSize:10},children:{marginTop:5,color:Colors.textMuted,fontSize:9},id:{marginTop:5,color:Colors.goldDark,fontSize:8,fontWeight:FontWeight.bold},event:{minHeight:83,padding:13,flexDirection:'row',alignItems:'center',gap:11,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.lg,backgroundColor:Colors.paper},check:{width:38,height:38,alignItems:'center',justifyContent:'center',borderRadius:13,backgroundColor:Colors.successLight},late:{paddingHorizontal:7,paddingVertical:4,borderRadius:8,overflow:'hidden',color:Colors.error,backgroundColor:Colors.errorLight,fontSize:8,fontWeight:FontWeight.extrabold},private:{marginTop:18,padding:14,flexDirection:'row',alignItems:'center',gap:8,borderRadius:Radius.md,backgroundColor:Colors.mintLight},privateText:{flex:1,color:Colors.textSecondary,fontSize:10,lineHeight:15},
});
