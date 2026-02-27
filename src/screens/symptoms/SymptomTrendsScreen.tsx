import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/EmptyState';

type Mood = 'Good' | 'Neutral' | 'Bad';
type MoodFilter = 'All' | Mood;
const MOODS: Mood[] = ['Good', 'Neutral', 'Bad'];

const isDateInRange = (dateKey: string, from: string, to: string) => {
  if (from && dateKey < from) return false;
  if (to && dateKey > to) return false;
  return true;
};

export function SymptomTrendsScreen() {
  const { symptoms, medications, addSymptomEntry, deleteSymptomEntry } = useData();
  const [pain, setPain] = useState('3');
  const [fatigue, setFatigue] = useState('3');
  const [sleepHours, setSleepHours] = useState('7');
  const [mood, setMood] = useState<Mood>('Neutral');
  const [note, setNote] = useState('');
  const [moodFilter, setMoodFilter] = useState<MoodFilter>('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const valid =
    Number(pain) >= 0 &&
    Number(pain) <= 10 &&
    Number(fatigue) >= 0 &&
    Number(fatigue) <= 10 &&
    Number(sleepHours) >= 0 &&
    Number(sleepHours) <= 24;

  const filteredSymptoms = useMemo(() => {
    return symptoms.filter(s => {
      const moodOk = moodFilter === 'All' || s.mood === moodFilter;
      const dateOk = isDateInRange(s.dateKey, fromDate.trim(), toDate.trim());
      return moodOk && dateOk;
    });
  }, [symptoms, moodFilter, fromDate, toDate]);

  const summary = useMemo(() => {
    if (filteredSymptoms.length === 0) return { avgPain: 0, avgFatigue: 0, avgSleep: 0, trend: 'No data yet' };
    const last7 = filteredSymptoms.slice(0, 7);
    const prev7 = filteredSymptoms.slice(7, 14);
    const avg = (arr: number[]) => (arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0);
    const avgPain = avg(last7.map(s => s.pain));
    const avgFatigue = avg(last7.map(s => s.fatigue));
    const avgSleep = avg(last7.map(s => s.sleepHours));
    const lastPain = avg(last7.map(s => s.pain));
    const prevPain = avg(prev7.map(s => s.pain));
    const trend =
      prev7.length === 0
        ? 'Need more data for trend'
        : lastPain < prevPain
          ? 'Pain improving vs previous week'
          : lastPain > prevPain
            ? 'Pain worsening vs previous week'
            : 'Pain stable vs previous week';
    return { avgPain, avgFatigue, avgSleep, trend };
  }, [filteredSymptoms]);

  const correlation = useMemo(() => {
    if (filteredSymptoms.length === 0 || medications.length === 0) {
      return { card: 'Need symptom + medication data for correlation.' };
    }

    const adherenceByDay = new Map<string, number>();
    const relevantDays = new Set(filteredSymptoms.map(s => s.dateKey));
    for (const day of relevantDays) {
      const targets = medications.reduce((sum, m) => sum + m.slots.length, 0);
      const taken = medications.reduce(
        (sum, m) => sum + m.slots.filter(slot => m.takenSlotKeys.includes(`${day}|${slot}`)).length,
        0,
      );
      adherenceByDay.set(day, targets === 0 ? 0 : Math.round((taken / targets) * 100));
    }

    const highDays = filteredSymptoms.filter(s => (adherenceByDay.get(s.dateKey) ?? 0) >= 70);
    const lowDays = filteredSymptoms.filter(s => (adherenceByDay.get(s.dateKey) ?? 0) < 70);
    if (highDays.length === 0 || lowDays.length === 0) {
      return { card: 'Need both high-adherence and low-adherence days.' };
    }

    const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
    const highPain = avg(highDays.map(d => d.pain));
    const lowPain = avg(lowDays.map(d => d.pain));
    const highFatigue = avg(highDays.map(d => d.fatigue));
    const lowFatigue = avg(lowDays.map(d => d.fatigue));
    const painBetter = highPain < lowPain;
    const fatigueBetter = highFatigue < lowFatigue;

    if (painBetter && fatigueBetter) return { card: 'Higher adherence is associated with better symptoms.' };
    if (!painBetter && !fatigueBetter) return { card: 'Higher adherence is associated with worse symptoms.' };
    return { card: 'Higher adherence is associated with mixed symptom changes.' };
  }, [filteredSymptoms, medications]);

  return (
    <ScreenContainer>
      <FlatList
        data={filteredSymptoms}
        keyExtractor={x => x.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <AppCard>
              <Text style={styles.title}>Log Today Symptoms</Text>
              <Text style={styles.label}>Pain (0-10)</Text>
              <TextInput value={pain} onChangeText={setPain} keyboardType="numeric" style={styles.input} />
              <Text style={[styles.label, styles.spaced]}>Fatigue (0-10)</Text>
              <TextInput value={fatigue} onChangeText={setFatigue} keyboardType="numeric" style={styles.input} />
              <Text style={[styles.label, styles.spaced]}>Sleep hours (0-24)</Text>
              <TextInput value={sleepHours} onChangeText={setSleepHours} keyboardType="numeric" style={styles.input} />
              <Text style={[styles.label, styles.spaced]}>Mood</Text>
              <View style={styles.row}>
                {MOODS.map(m => (
                  <Pressable key={m} onPress={() => setMood(m)} style={[styles.pill, mood === m && styles.pillOn]}>
                    <Text style={[styles.pillTxt, mood === m && styles.pillTxtOn]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={[styles.label, styles.spaced]}>Optional note</Text>
              <TextInput value={note} onChangeText={setNote} style={[styles.input, styles.multi]} multiline />
              <Text style={styles.spaced} />
              <AppButton
                title="Save Entry"
                disabled={!valid}
                onPress={() => {
                  addSymptomEntry(Number(pain), Number(fatigue), Number(sleepHours), mood, note.trim());
                  setNote('');
                }}
              />
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Search + Filters</Text>
              <TextInput value={fromDate} onChangeText={setFromDate} style={styles.input} placeholder="From date (YYYY-MM-DD)" />
              <TextInput value={toDate} onChangeText={setToDate} style={[styles.input, styles.spaced]} placeholder="To date (YYYY-MM-DD)" />
              <View style={[styles.row, styles.spaced]}>
                {(['All', ...MOODS] as MoodFilter[]).map(m => (
                  <Pressable key={m} onPress={() => setMoodFilter(m)} style={[styles.pill, moodFilter === m && styles.pillOn]}>
                    <Text style={[styles.pillTxt, moodFilter === m && styles.pillTxtOn]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Trend Summary (Filtered)</Text>
              <Text style={styles.meta}>Avg Pain: {summary.avgPain}</Text>
              <Text style={styles.meta}>Avg Fatigue: {summary.avgFatigue}</Text>
              <Text style={styles.meta}>Avg Sleep: {summary.avgSleep}h</Text>
              <Text style={[styles.meta, styles.trend]}>{summary.trend}</Text>
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Symptom-Medication Correlation</Text>
              <Text style={[styles.meta, styles.trend]}>{correlation.card}</Text>
            </AppCard>
          </>
        }
        ListEmptyComponent={<EmptyState text="No symptom entries for selected filters." />}
        renderItem={({ item }) => (
          <AppCard>
            <Text style={styles.itemTitle}>{item.date}</Text>
            <Text style={styles.meta}>
              Pain: {item.pain} | Fatigue: {item.fatigue} | Sleep: {item.sleepHours}h
            </Text>
            <Text style={styles.meta}>Mood: {item.mood}</Text>
            {item.note ? <Text style={styles.meta}>Note: {item.note}</Text> : null}
            <Text style={styles.spaced} />
            <AppButton title="Delete" variant="danger" onPress={() => deleteSymptomEntry(item.id)} />
          </AppCard>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: 12 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  label: { marginTop: 8, fontWeight: '800', color: COLORS.muted },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: { marginTop: 8, flexDirection: 'row', gap: 8 },
  pill: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  pillOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  pillTxt: { color: COLORS.text, fontWeight: '800', fontSize: 12 },
  pillTxtOn: { color: 'white' },
  multi: { minHeight: 90, textAlignVertical: 'top' },
  spaced: { marginTop: 10 },
  itemTitle: { fontWeight: '900', color: COLORS.text },
  meta: { marginTop: 6, color: COLORS.muted },
  trend: { fontWeight: '900', color: COLORS.brandDark },
});
