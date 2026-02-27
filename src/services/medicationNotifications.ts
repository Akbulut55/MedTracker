import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Medication, MedicationSlot } from '../state/DataContext';

const CHANNEL_ID = 'medtracker-medications';
const IDS_KEY = 'medtracker_notification_ids_v1';

const SLOT_HOURS: Record<MedicationSlot, number> = {
  Morning: 8,
  Noon: 12,
  Evening: 18,
  Night: 22,
};

const slotTimeMs = (slot: MedicationSlot) => {
  const now = new Date();
  const at = new Date();
  at.setHours(SLOT_HOURS[slot], 0, 0, 0);
  if (at.getTime() <= now.getTime()) at.setDate(at.getDate() + 1);
  return at.getTime();
};

const notifId = (medId: string, slot: MedicationSlot) => `med_${medId}_${slot}`;

export async function initMedicationNotifications() {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Medication Reminders',
    importance: AndroidImportance.HIGH,
  });
}

export async function syncMedicationNotifications(medications: Medication[]) {
  await initMedicationNotifications();

  const desiredIds: string[] = [];
  for (const m of medications) {
    for (const slot of m.slots) {
      const id = notifId(m.id, slot);
      desiredIds.push(id);
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: slotTimeMs(slot),
        repeatFrequency: RepeatFrequency.DAILY,
      };
      await notifee.createTriggerNotification(
        {
          id,
          title: `Medication Reminder (${slot})`,
          body: `${m.name} - ${m.dose}`,
          android: {
            channelId: CHANNEL_ID,
            pressAction: { id: 'default' },
          },
          data: { screen: 'Medications' },
        },
        trigger,
      );
    }
  }

  const raw = await AsyncStorage.getItem(IDS_KEY);
  const previousIds: string[] = raw ? JSON.parse(raw) : [];
  const toCancel = previousIds.filter(id => !desiredIds.includes(id));
  for (const id of toCancel) {
    await notifee.cancelTriggerNotification(id);
  }
  await AsyncStorage.setItem(IDS_KEY, JSON.stringify(desiredIds));
}
