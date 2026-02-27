import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { MedicationSlot, useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/EmptyState';
import { confirmAction, showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'Medications'>;
type StatusFilter = 'All' | 'Due Now' | 'Completed Now';

const SLOT_ORDER: MedicationSlot[] = ['Morning', 'Noon', 'Evening', 'Night'];
const todayKey = () => new Date().toISOString().slice(0, 10);
const currentSlot = (): MedicationSlot => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'Morning';
  if (hour >= 11 && hour < 15) return 'Noon';
  if (hour >= 15 && hour < 21) return 'Evening';
  return 'Night';
};

export function MedicationsScreen({ navigation }: Props) {
  const { medications, toggleMedicationTaken, deleteMedication } = useData();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('All');
  const nowSlot = currentSlot();
  const today = todayKey();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('AddMedication')} style={styles.headerBtnWrap}>
          <Text style={styles.headerBtnTxt}>+ Add</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const dueNowCount = medications.filter(m => m.slots.includes(nowSlot) && !m.takenSlotKeys.includes(`${today}|${nowSlot}`)).length;

  const filtered = useMemo(() => {
    return medications.filter(m => {
      const q = query.trim().toLowerCase();
      const matchesText = !q || m.name.toLowerCase().includes(q) || m.dose.toLowerCase().includes(q);
      const isCompletedNow = m.slots.includes(nowSlot) && m.takenSlotKeys.includes(`${today}|${nowSlot}`);
      const isDueNow = m.slots.includes(nowSlot) && !m.takenSlotKeys.includes(`${today}|${nowSlot}`);
      const matchesFilter = filter === 'All' || (filter === 'Due Now' ? isDueNow : isCompletedNow);
      return matchesText && matchesFilter;
    });
  }, [medications, query, filter, nowSlot, today]);

  return (
    <ScreenContainer>
      <FlatList
        data={filtered}
        keyExtractor={x => x.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <AppCard>
              <Text style={styles.title}>Current Slot: {nowSlot}</Text>
              <Text style={styles.sub}>{dueNowCount} medication(s) due now</Text>
            </AppCard>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search medication or dose..."
              style={styles.search}
            />
            <View style={styles.filterRow}>
              {(['All', 'Due Now', 'Completed Now'] as StatusFilter[]).map(item => (
                <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterPill, filter === item && styles.filterPillOn]}>
                  <Text style={[styles.filterTxt, filter === item && styles.filterTxtOn]}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <AppButton title="View Adherence Summary" variant="secondary" onPress={() => navigation.navigate('MedicationAdherence')} />
          </View>
        }
        ListEmptyComponent={<EmptyState text="No medications match your filters." />}
        renderItem={({ item }) => {
          const completedToday = item.slots.filter(slot => item.takenSlotKeys.includes(`${today}|${slot}`)).length;
          const totalToday = item.slots.length;
          return (
            <AppCard>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.sub}>Dose: {item.dose}</Text>
              <Text style={styles.sub}>Frequency: {item.frequency}</Text>
              <Text style={styles.sub}>Progress today: {completedToday}/{totalToday}</Text>
              <View style={styles.slotWrap}>
                {SLOT_ORDER.filter(slot => item.slots.includes(slot)).map(slot => {
                  const done = item.takenSlotKeys.includes(`${today}|${slot}`);
                  return (
                    <Pressable key={slot} onPress={() => toggleMedicationTaken(item.id, slot)} style={[styles.pill, done && styles.pillOn]}>
                      <Text style={[styles.pillTxt, done && styles.pillTxtOn]}>{slot}: {done ? 'Taken' : 'Due'}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.row}>
                <View style={styles.col}>
                  <AppButton title="Edit" variant="secondary" onPress={() => navigation.navigate('EditMedication', { id: item.id })} />
                </View>
                <View style={styles.col}>
                  <AppButton
                    title="Delete"
                    variant="danger"
                    onPress={() =>
                      confirmAction('Delete medication', `${item.name} silinsin mi?`, () => {
                        deleteMedication(item.id);
                        showSuccess('Medication deleted.');
                      })
                    }
                  />
                </View>
              </View>
            </AppCard>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: 12 },
  headerWrap: { gap: 12 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  sub: { marginTop: 6, color: COLORS.text },
  search: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  filterPillOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  filterTxt: { color: COLORS.text, fontWeight: '800', fontSize: 12 },
  filterTxtOn: { color: 'white' },
  row: { marginTop: 10, flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  slotWrap: { marginTop: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  pillOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  pillTxt: { color: COLORS.text, fontWeight: '800' },
  pillTxtOn: { color: 'white' },
  headerBtnWrap: { paddingHorizontal: 10, paddingVertical: 6 },
  headerBtnTxt: { color: 'white', fontWeight: '900' },
});
