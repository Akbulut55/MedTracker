/**
 * @format
 */
import 'react-native-gesture-handler';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { scheduleSnoozeNotification } from './src/services/medicationNotifications';

const PENDING_ACTIONS_KEY = 'medtracker_pending_actions_v1';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS) return;
  const action = detail.pressAction?.id;
  const medicationId = detail.notification?.data?.medicationId;
  const slot = detail.notification?.data?.slot;
  const body = detail.notification?.body ?? '';
  const [namePart, dosePart] = body.split(' - ');

  if (action === 'snooze' && medicationId && slot && namePart && dosePart) {
    await scheduleSnoozeNotification(namePart, dosePart, slot, medicationId);
    return;
  }

  if (action === 'taken' && medicationId && slot) {
    const raw = await AsyncStorage.getItem(PENDING_ACTIONS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ action, medicationId, slot });
    await AsyncStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(list));
  }
});

AppRegistry.registerComponent(appName, () => App);
