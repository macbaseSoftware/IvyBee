import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function enablePushNotifications(demo = false) {
  if (Platform.OS === 'web') return { enabled: false, reason: 'Push notifications are enabled in the Android and iPhone app.' };
  if (!Device.isDevice) return { enabled: false, reason: 'Use a physical phone to register for push notifications.' };

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('school-updates', {
      name: 'School updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F2C94C',
    });
  }

  let permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') return { enabled: false, reason: 'Notification permission was not granted.' };

  if (demo) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Ivybee notifications are on', body: 'New teacher updates will appear here.', data: { screen: 'groups' } },
      trigger: null,
    });
    return { enabled: true, reason: 'Demo notification sent.' };
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return { enabled: false, reason: 'The Expo project ID is not configured.' };
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await api.registerPushDevice(token, Platform.OS as 'ios' | 'android', Device.deviceName ?? undefined);
  return { enabled: true, reason: 'Teacher update notifications are enabled.' };
}
