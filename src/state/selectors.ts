import type { Medication, MedicationSlot, SymptomEntry } from './DataContext';

export const slotOrder: MedicationSlot[] = ['Morning', 'Noon', 'Evening', 'Night'];

export const dateKey = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
};

export function currentSlot(now = new Date()): MedicationSlot {
  const hour = now.getHours();
  if (hour >= 6 && hour < 11) return 'Morning';
  if (hour >= 11 && hour < 15) return 'Noon';
  if (hour >= 15 && hour < 21) return 'Evening';
  return 'Night';
}

export function buildDayList(days: number) {
  return Array.from({ length: days }, (_, i) => dateKey(i));
}

export function adherenceForDay(medications: Medication[], day: string) {
  const targets = medications.reduce((sum, m) => sum + m.slots.length, 0);
  if (targets === 0) return 0;
  const taken = medications.reduce(
    (sum, m) => sum + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length,
    0,
  );
  return Math.round((taken / targets) * 100);
}

export function adherenceForRange(medications: Medication[], days: string[]) {
  const targets = medications.reduce((sum, m) => sum + m.slots.length * days.length, 0);
  if (targets === 0) return 0;
  const taken = medications.reduce((sum, m) => {
    const count = days.reduce(
      (inner, day) => inner + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length,
      0,
    );
    return sum + count;
  }, 0);
  return Math.round((taken / targets) * 100);
}

export function medicationCurrentStreak(medication: Medication, maxDays = 60) {
  let streak = 0;
  for (let i = 0; i < maxDays; i += 1) {
    const day = dateKey(i);
    const allTaken = medication.slots.every(slot => medication.takenSlotKeys.includes(`${day}|${slot}`));
    if (!allTaken) break;
    streak += 1;
  }
  return streak;
}

export function missedDoseInsights(medications: Medication[], days = 7) {
  const today = dateKey(0);
  const dayList = buildDayList(days);
  const missedToday = medications.reduce((sum, m) => {
    const missed = m.slots.filter(slot => !m.takenSlotKeys.includes(`${today}|${slot}`)).length;
    return sum + missed;
  }, 0);

  const perMedicationMiss = medications.map(m => {
    const targets = m.slots.length * dayList.length;
    const taken = dayList.reduce(
      (inner, day) => inner + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length,
      0,
    );
    return { id: m.id, name: m.name, missed: targets - taken, streak: medicationCurrentStreak(m) };
  });

  const weekMissedTotal = perMedicationMiss.reduce((sum, x) => sum + x.missed, 0);
  const mostMissed = [...perMedicationMiss].sort((a, b) => b.missed - a.missed)[0] ?? null;
  const bestStreak = [...perMedicationMiss].sort((a, b) => b.streak - a.streak)[0] ?? null;
  return { missedToday, weekMissedTotal, mostMissed, bestStreak };
}

export function weeklySymptomSummary(symptoms: SymptomEntry[]) {
  const last7 = symptoms.slice(0, 7);
  if (last7.length === 0) return { avgPain: 0, avgFatigue: 0, avgSleep: 0 };
  const avg = (arr: number[]) => Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
  return {
    avgPain: avg(last7.map(s => s.pain)),
    avgFatigue: avg(last7.map(s => s.fatigue)),
    avgSleep: avg(last7.map(s => s.sleepHours)),
  };
}

export function correlationWithConfidence(
  medications: Medication[],
  symptoms: SymptomEntry[],
  symptomRows: SymptomEntry[],
) {
  if (symptomRows.length === 0 || medications.length === 0) {
    return { summary: 'Need symptom + medication data for correlation.', confidence: 0 };
  }

  const adherenceByDay = new Map<string, number>();
  const relevantDays = new Set(symptomRows.map(s => s.dateKey));
  for (const day of relevantDays) {
    adherenceByDay.set(day, adherenceForDay(medications, day));
  }

  const highDays = symptomRows.filter(s => (adherenceByDay.get(s.dateKey) ?? 0) >= 70);
  const lowDays = symptomRows.filter(s => (adherenceByDay.get(s.dateKey) ?? 0) < 70);
  if (highDays.length < 2 || lowDays.length < 2) {
    return { summary: 'Insufficient high/low adherence day groups.', confidence: 0.25 };
  }

  const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
  const highPain = avg(highDays.map(d => d.pain));
  const lowPain = avg(lowDays.map(d => d.pain));
  const highFatigue = avg(highDays.map(d => d.fatigue));
  const lowFatigue = avg(lowDays.map(d => d.fatigue));
  const painDiff = lowPain - highPain;
  const fatigueDiff = lowFatigue - highFatigue;
  const days = highDays.length + lowDays.length;
  const confidence = Math.max(0.1, Math.min(0.99, (days / 30) * 0.6 + (Math.abs(painDiff) + Math.abs(fatigueDiff)) / 20));

  if (painDiff > 0 && fatigueDiff > 0) {
    return { summary: 'Higher adherence is associated with better symptoms.', confidence };
  }
  if (painDiff < 0 && fatigueDiff < 0) {
    return { summary: 'Higher adherence is associated with worse symptoms.', confidence };
  }
  return { summary: 'Higher adherence is associated with mixed symptom changes.', confidence };
}
