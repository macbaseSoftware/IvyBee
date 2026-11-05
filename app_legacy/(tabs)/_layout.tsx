import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { Colors, FontWeight, Typography } from '../../constants';
import { useAuth } from '../../store/authStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return <Ionicons name={name} size={22} color={focused ? Colors.primary : '#8C8B82'} />;
}

export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/(auth)/login');
  }, [user, isLoading]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: '#8C8B82',
        tabBarStyle: {
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 0,
          backgroundColor: Colors.paper,
          shadowColor: Colors.ink,
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontFamily: Typography.body,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Today', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} /> }} />
      <Tabs.Screen name="my-learning" options={{ title: 'Progress', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'analytics' : 'analytics-outline'} focused={focused} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Discover', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'compass' : 'compass-outline'} focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} /> }} />
    </Tabs>
  );
}
