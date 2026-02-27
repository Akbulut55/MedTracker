import { adherenceForDay, correlationWithConfidence, dateKey, missedDoseInsights } from '../src/state/selectors';
import type { Medication, SymptomEntry } from '../src/state/DataContext';

const medication: Medication = {
  id: 'm1',
  name: 'Med A',
  dose: '10mg',
  frequency: '2/day',
  createdAt: 'now',
  slots: ['Morning', 'Evening'],
  takenSlotKeys: [`${dateKey(0)}|Morning`, `${dateKey(0)}|Evening`, `${dateKey(1)}|Morning`],
};

test('adherenceForDay calculates slot adherence percentage', () => {
  const value = adherenceForDay([medication], dateKey(0));
  expect(value).toBe(100);
});

test('missedDoseInsights returns most missed and best streak', () => {
  const stats = missedDoseInsights([medication], 2);
  expect(stats.mostMissed?.name).toBe('Med A');
  expect(stats.bestStreak?.streak).toBeGreaterThanOrEqual(1);
});

test('correlationWithConfidence handles insufficient groups', () => {
  const symptoms: SymptomEntry[] = [
    { id: 's1', date: 'd1', dateKey: dateKey(0), pain: 5, fatigue: 5, sleepHours: 7, mood: 'Neutral', note: '' },
  ];
  const result = correlationWithConfidence([medication], symptoms, symptoms);
  expect(result.summary).toContain('Insufficient');
});
