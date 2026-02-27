import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Medication, MedicationSlot } from '../state/DataContext';
import { buildNotificationPlan, NotificationConfig } from './notificationPlanning';

export const CHANNEL_ID = 'medtracker-medications';
const IDS_KEY = 'medtracker_notification_ids_v1';

export async function initMedicationNotifications() {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Medication Reminders',
    importance: AndroidImportance.HIGH,
  });
}

export async function scheduleSnoozeNotification(medicationName: string, dose: string, slot: MedicationSlot, medicationId: string) {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 10 * 60 * 1000,
  };
  await notifee.createTriggerNotification(
    {
      id: `snooze_${medicationId}_${slot}_${Date.now()}`,
      title: `Medication Snooze (${slot})`,
      body: `${medicationName} - ${dose}`,
      android: {
        channelId: CHANNEL_ID,
        pressAction: { id: 'default' },
      },
      data: { screen: 'Medications', medicationId, slot },
    },
    trigger,
  );
}

export async function syncMedicationNotifications(medications: Medication[], config: NotificationConfig) {
  await initMedicationNotifications();
  const plan = buildNotificationPlan(medications, config);
  const desiredIds = plan.map(x => x.id);

  for (const item of plan) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: item.timestamp,
      repeatFrequency: RepeatFrequency.DAILY,
    };
    await notifee.createTriggerNotification(
      {
        id: item.id,
        title: item.title,
        body: item.body,
        android: {
          channelId: CHANNEL_ID,
          pressAction: { id: 'default' },
          actions: [
            { title: 'Taken', pressAction: { id: 'taken' } },
            { title: 'Snooze 10m', pressAction: { id: 'snooze' } },
          ],
        },
        data: { screen: 'Medications', medicationId: item.medicationId, slot: item.slot },
      },
      trigger,
    );
  }

  const raw = await AsyncStorage.getItem(IDS_KEY);
  const previousIds: string[] = raw ? JSON.parse(raw) : [];
  const toCancel = previousIds.filter(id => !desiredIds.includes(id));
  for (const id of toCancel) {
    await notifee.cancelTriggerNotification(id);
  }
  await AsyncStorage.setItem(IDS_KEY, JSON.stringify(desiredIds));
}
