import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { Colors, FontWeight, Typography } from '../../constants';
import { useAuth } from '../../store/authStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return <Ionicons name={name} size={22} color={focused ? Colors.ink : Colors.textMuted} />;
}

export default function TabsLayout() {
  const { user, isLoading } = useAuth();
  useEffect(() => { if (!isLoading && !user) router.replace('/(auth)/login'); }, [user, isLoading]);

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.ink,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: { height: 74, paddingTop: 8, paddingBottom: 9, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.paper },
      tabBarLabelStyle: { fontFamily: Typography.body, fontSize: 10, fontWeight: FontWeight.bold },
      tabBarHideOnKeyboard: true,
    }}>
      <Tabs.Screen name="home" options={{ title: 'Children', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'people' : 'people-outline'} focused={focused} /> }} />
      <Tabs.Screen name="groups" options={{ title: 'Groups', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} /> }} />
      <Tabs.Screen name="safety" options={{ title: 'Collection', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} focused={focused} /> }} />
      <Tabs.Screen name="play" options={{ href: null }} />
      <Tabs.Screen name="statements" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ title: 'Payments', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} /> }} />
    </Tabs>
  );
}
