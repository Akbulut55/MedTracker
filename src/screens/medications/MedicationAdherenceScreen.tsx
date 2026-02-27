import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { MedicationSlot, useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { EmptyState } from '../../components/ui/EmptyState';

const SLOT_ORDER: MedicationSlot[] = ['Morning', 'Noon', 'Evening', 'Night'];
const dateKey = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
};

const dayList = (count: number) => Array.from({ length: count }, (_, i) => dateKey(i));

const medicationCurrentStreak = (takenSlotKeys: string[], slots: MedicationSlot[]) => {
  let streak = 0;
  for (let i = 0; i < 30; i += 1) {
    const day = dateKey(i);
    const allTaken = slots.every(slot => takenSlotKeys.includes(`${day}|${slot}`));
    if (!allTaken) break;
    streak += 1;
  }
  return streak;
};

export function MedicationAdherenceScreen() {
  const { medications } = useData();
  const today = dateKey(0);

  const todayRate = useMemo(() => {
    const targets = medications.reduce((sum, m) => sum + m.slots.length, 0);
    if (targets === 0) return 0;
    const taken = medications.reduce(
      (sum, m) => sum + m.slots.filter(slot => m.takenSlotKeys.includes(`${today}|${slot}`)).length,
      0,
    );
    return Math.round((taken / targets) * 100);
  }, [medications, today]);

  const weeklyRate = useMemo(() => {
    const days = dayList(7);
    const targets = medications.reduce((sum, m) => sum + m.slots.length * days.length, 0);
    if (targets === 0) return 0;
    const taken = medications.reduce((sum, m) => {
      const count = days.reduce((inner, day) => inner + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length, 0);
      return sum + count;
    }, 0);
    return Math.round((taken / targets) * 100);
  }, [medications]);

  const insights = useMemo(() => {
    const days = dayList(7);
    const missedToday = medications.reduce((sum, m) => {
      const missed = m.slots.filter(slot => !m.takenSlotKeys.includes(`${today}|${slot}`)).length;
      return sum + missed;
    }, 0);

    const weekMissedTotal = medications.reduce((sum, m) => {
      const targets = m.slots.length * days.length;
      const taken = days.reduce((inner, day) => inner + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length, 0);
      return sum + (targets - taken);
    }, 0);

    const perMedicationMiss = medications.map(m => {
      const targets = m.slots.length * days.length;
      const taken = days.reduce((inner, day) => inner + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length, 0);
      return { id: m.id, name: m.name, missed: targets - taken };
    });
    const mostMissed = perMedicationMiss.sort((a, b) => b.missed - a.missed)[0];

    const streaks = medications.map(m => ({ id: m.id, name: m.name, streak: medicationCurrentStreak(m.takenSlotKeys, m.slots) }));
    const bestStreak = streaks.sort((a, b) => b.streak - a.streak)[0];

    return { missedToday, weekMissedTotal, mostMissed, bestStreak };
  }, [medications, today]);

  return (
    <ScreenContainer>
      <FlatList
        data={medications}
        keyExtractor={x => x.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <AppCard>
              <Text style={styles.title}>Today Slot Adherence</Text>
              <Text style={styles.value}>{todayRate}%</Text>
              <Text style={styles.meta}>Taken slots / scheduled slots today</Text>
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Last 7 Days Slot Adherence</Text>
              <Text style={styles.value}>{weeklyRate}%</Text>
              <Text style={styles.meta}>Taken slots / scheduled slots in 7 days</Text>
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Missed-Dose Insights</Text>
              <Text style={styles.meta}>Missed slots today: {insights.missedToday}</Text>
              <Text style={styles.meta}>Missed slots in last 7 days: {insights.weekMissedTotal}</Text>
              <Text style={styles.meta}>
                Most missed medication: {insights.mostMissed ? `${insights.mostMissed.name} (${insights.mostMissed.missed} missed)` : 'N/A'}
              </Text>
              <Text style={styles.meta}>
                Best adherence streak: {insights.bestStreak ? `${insights.bestStreak.name} (${insights.bestStreak.streak} day)` : 'N/A'}
              </Text>
            </AppCard>
          </>
        }
        ListEmptyComponent={<EmptyState text="No medications to analyze yet." />}
        renderItem={({ item }) => {
          const weekDays = dayList(7);
          const weekTaken = weekDays.reduce(
            (sum, day) => sum + item.slots.filter(slot => item.takenSlotKeys.includes(`${day}|${slot}`)).length,
            0,
          );
          const weekTarget = item.slots.length * weekDays.length;
          const weekPct = weekTarget === 0 ? 0 : Math.round((weekTaken / weekTarget) * 100);
          return (
            <AppCard>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.dose} | {item.frequency}
              </Text>
              <Text style={styles.meta}>Slots: {SLOT_ORDER.filter(slot => item.slots.includes(slot)).join(', ')}</Text>
              <Text style={styles.meta}>Weekly adherence: {weekTaken}/{weekTarget} ({weekPct}%)</Text>
            </AppCard>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: 12 },
  title: { fontWeight: '900', color: COLORS.text },
  value: { marginTop: 6, fontWeight: '900', fontSize: 26, color: COLORS.brandDark },
  itemTitle: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  meta: { marginTop: 6, color: COLORS.muted },
});
