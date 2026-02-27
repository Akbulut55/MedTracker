import type { Medication, MedicationSlot } from '../state/DataContext';

export type NotificationConfig = {
  slotTimes: Record<MedicationSlot, string>;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
};

type PlanItem = {
  id: string;
  medicationId: string;
  slot: MedicationSlot;
  title: string;
  body: string;
  timestamp: number;
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const inQuietHours = (minutes: number, start: number, end: number) => {
  if (start === end) return true;
  if (start < end) return minutes >= start && minutes < end;
  return minutes >= start || minutes < end;
};

const slotTimeMs = (slot: MedicationSlot, config: NotificationConfig, now = new Date()) => {
  const at = new Date(now);
  const [h, m] = config.slotTimes[slot].split(':').map(Number);
  at.setHours(h, m, 0, 0);

  if (config.quietHoursEnabled) {
    const start = toMinutes(config.quietStart);
    const end = toMinutes(config.quietEnd);
    const minutes = h * 60 + m;
    if (inQuietHours(minutes, start, end)) {
      const [eh, em] = config.quietEnd.split(':').map(Number);
      at.setHours(eh, em, 0, 0);
    }
  }

  if (at.getTime() <= now.getTime()) at.setDate(at.getDate() + 1);
  return at.getTime();
};

const notifId = (medId: string, slot: MedicationSlot) => `med_${medId}_${slot}`;

export function buildNotificationPlan(medications: Medication[], config: NotificationConfig, now = new Date()): PlanItem[] {
  return medications.flatMap(m =>
    m.slots.map(slot => ({
      id: notifId(m.id, slot),
      medicationId: m.id,
      slot,
      title: `Medication Reminder (${slot})`,
      body: `${m.name} - ${m.dose}`,
      timestamp: slotTimeMs(slot, config, now),
    })),
  );
}
