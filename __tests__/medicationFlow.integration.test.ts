import { addMedicationReducer, toggleMedicationTakenReducer } from '../src/state/reducers';
import { buildNotificationPlan, NotificationConfig } from '../src/services/notificationPlanning';
import type { Medication } from '../src/state/DataContext';

const config: NotificationConfig = {
  slotTimes: { Morning: '08:00', Noon: '12:00', Evening: '18:00', Night: '22:00' },
  quietHoursEnabled: false,
  quietStart: '23:00',
  quietEnd: '06:00',
};

test('add medication -> notification plan -> mark taken flow', () => {
  let medications: Medication[] = [];
  medications = addMedicationReducer(medications, {
    id: 'm1',
    name: 'Med X',
    dose: '5mg',
    frequency: '2/day',
    slots: ['Morning', 'Evening'],
    createdAt: 'today',
  });

  const plan = buildNotificationPlan(medications, config, new Date('2026-01-01T07:00:00.000Z'));
  expect(plan.length).toBe(2);
  expect(plan[0].title).toContain('Medication Reminder');

  medications = toggleMedicationTakenReducer(medications, {
    id: 'm1',
    slot: 'Morning',
    day: '2026-01-01',
  });
  expect(medications[0].takenSlotKeys).toContain('2026-01-01|Morning');
});
