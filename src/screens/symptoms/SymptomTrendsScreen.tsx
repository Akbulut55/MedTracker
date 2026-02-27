import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { correlationWithConfidence, weeklySymptomSummary } from '../../state/selectors';
import { confirmAction, showSuccess } from '../../utils/feedback';
import { isValidDateInput, maskDateInput } from '../../utils/masks';

type Mood = 'Good' | 'Neutral' | 'Bad';
type MoodFilter = 'All' | Mood;
const MOODS: Mood[] = ['Good', 'Neutral', 'Bad'];

function MiniBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);
  return (
    <View style={styles.bars}>
      {values.map((value, idx) => (
        <View key={`${idx}_${value}`} style={[styles.bar, { height: Math.max(6, (value / max) * 50), backgroundColor: color }]} />
      ))}
    </View>
  );
}

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
  const [rangeError, setRangeError] = useState('');

  const valid =
    Number(pain) >= 0 &&
    Number(pain) <= 10 &&
    Number(fatigue) >= 0 &&
    Number(fatigue) <= 10 &&
    Number(sleepHours) >= 0 &&
    Number(sleepHours) <= 24;

  const normalizedRange = useMemo(() => {
    const from = fromDate.trim();
    const to = toDate.trim();
    if (from && !isValidDateInput(from)) return { from, to, error: 'From date must be YYYY-MM-DD.' };
    if (to && !isValidDateInput(to)) return { from, to, error: 'To date must be YYYY-MM-DD.' };
    if (from && to && from > to) return { from, to, error: 'From date cannot be greater than To date.' };
    return { from, to, error: '' };
  }, [fromDate, toDate]);

  const filteredSymptoms = useMemo(() => {
    if (normalizedRange.error) return [];
    return symptoms.filter(s => {
      const moodOk = moodFilter === 'All' || s.mood === moodFilter;
      const dateOk = isDateInRange(s.dateKey, normalizedRange.from, normalizedRange.to);
      return moodOk && dateOk;
    });
  }, [symptoms, moodFilter, normalizedRange]);

  const summary = useMemo(() => weeklySymptomSummary(filteredSymptoms), [filteredSymptoms]);

  const trend = useMemo(() => {
    const last7 = filteredSymptoms.slice(0, 7);
    const prev7 = filteredSymptoms.slice(7, 14);
    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const lastPain = avg(last7.map(s => s.pain));
    const prevPain = avg(prev7.map(s => s.pain));
    if (prev7.length === 0) return 'Need more data for trend';
    if (lastPain < prevPain) return 'Pain improving vs previous week';
    if (lastPain > prevPain) return 'Pain worsening vs previous week';
    return 'Pain stable vs previous week';
  }, [filteredSymptoms]);

  const correlation = useMemo(() => correlationWithConfidence(medications, symptoms, filteredSymptoms), [medications, symptoms, filteredSymptoms]);

  const painSeries = useMemo(() => filteredSymptoms.slice(0, 7).map(s => s.pain).reverse(), [filteredSymptoms]);
  const fatigueSeries = useMemo(() => filteredSymptoms.slice(0, 7).map(s => s.fatigue).reverse(), [filteredSymptoms]);

  React.useEffect(() => {
    setRangeError(normalizedRange.error);
  }, [normalizedRange.error]);

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
              {!valid ? <Text style={styles.error}>Pain/Fatigue 0-10 and sleep 0-24 must be valid.</Text> : null}
              <Text style={styles.spaced} />
              <AppButton
                title="Save Entry"
                disabled={!valid}
                onPress={() => {
                  addSymptomEntry(Number(pain), Number(fatigue), Number(sleepHours), mood, note.trim());
                  setNote('');
                  showSuccess('Symptom entry saved.');
                }}
              />
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Search + Filters</Text>
              <TextInput
                value={fromDate}
                onChangeText={v => setFromDate(maskDateInput(v))}
                style={styles.input}
                placeholder="From date (YYYY-MM-DD)"
                keyboardType="number-pad"
              />
              <TextInput
                value={toDate}
                onChangeText={v => setToDate(maskDateInput(v))}
                style={[styles.input, styles.spaced]}
                placeholder="To date (YYYY-MM-DD)"
                keyboardType="number-pad"
              />
              <View style={[styles.row, styles.spaced]}>
                {(['All', ...MOODS] as MoodFilter[]).map(m => (
                  <Pressable key={m} onPress={() => setMoodFilter(m)} style={[styles.pill, moodFilter === m && styles.pillOn]}>
                    <Text style={[styles.pillTxt, moodFilter === m && styles.pillTxtOn]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
              {rangeError ? <Text style={styles.error}>{rangeError}</Text> : null}
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Trend Summary (Filtered)</Text>
              <Text style={styles.meta}>Avg Pain: {summary.avgPain}</Text>
              <Text style={styles.meta}>Avg Fatigue: {summary.avgFatigue}</Text>
              <Text style={styles.meta}>Avg Sleep: {summary.avgSleep}h</Text>
              <Text style={[styles.meta, styles.trend]}>{trend}</Text>
              <Text style={[styles.meta, styles.mt6]}>Pain sparkline (last 7):</Text>
              <MiniBars values={painSeries.length ? painSeries : [0]} color="#EF4444" />
              <Text style={[styles.meta, styles.mt6]}>Fatigue sparkline (last 7):</Text>
              <MiniBars values={fatigueSeries.length ? fatigueSeries : [0]} color="#F59E0B" />
            </AppCard>
            <AppCard>
              <Text style={styles.title}>Symptom-Medication Correlation</Text>
              <Text style={[styles.meta, styles.trend]}>{correlation.summary}</Text>
              <Text style={styles.meta}>Confidence: {Math.round(correlation.confidence * 100)}%</Text>
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
            <AppButton
              title="Delete"
              variant="danger"
              onPress={() =>
                confirmAction('Delete symptom', 'Bu semptom kaydi silinsin mi?', () => {
                  deleteSymptomEntry(item.id);
                  showSuccess('Symptom entry deleted.');
                })
              }
            />
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
  mt6: { marginTop: 6 },
  itemTitle: { fontWeight: '900', color: COLORS.text },
  meta: { marginTop: 6, color: COLORS.muted },
  trend: { fontWeight: '900', color: COLORS.brandDark },
  bars: { marginTop: 4, height: 54, flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bar: { flex: 1, borderRadius: 3 },
  error: { marginTop: 8, color: COLORS.danger, fontWeight: '700' },
});
