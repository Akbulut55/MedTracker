import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { COLORS, SPACING } from '../../app/theme';
import { useData } from '../../state/DataContext';
import { adherenceForDay, currentSlot, dateKey, weeklySymptomSummary } from '../../state/selectors';
import { AppCard } from '../../components/ui/AppCard';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

type HomeRoute =
  | 'Profile'
  | 'Reminders'
  | 'Trainings'
  | 'Notes'
  | 'Medications'
  | 'Symptoms'
  | 'InfoShare'
  | 'Suggestions'
  | 'Exercise'
  | 'Ratings'
  | 'Help';

const MENU: { key: HomeRoute; title: string; icon: string }[] = [
  { key: 'Profile', title: 'Profile', icon: '👤' },
  { key: 'Reminders', title: 'Reminders', icon: '⏰' },
  { key: 'Trainings', title: 'Trainings', icon: '📘' },
  { key: 'Notes', title: 'Notes', icon: '📝' },
  { key: 'Medications', title: 'Medications', icon: '💊' },
  { key: 'Symptoms', title: 'Symptoms', icon: '📈' },
  { key: 'InfoShare', title: 'Info Sharing', icon: '💬' },
  { key: 'Suggestions', title: 'Suggestions', icon: '💡' },
  { key: 'Exercise', title: 'Nutrition & Exercise', icon: '🏃' },
  { key: 'Ratings', title: 'Ratings', icon: '⭐' },
  { key: 'Help', title: 'Help', icon: '🆘' },
];

export function HomeScreen({ navigation }: Props) {
  const { medications, symptoms } = useData();

  const dashboard = useMemo(() => {
    const slot = currentSlot();
    const day = dateKey(0);
    const dueNow = medications.filter(m => m.slots.includes(slot) && !m.takenSlotKeys.includes(`${day}|${slot}`)).length;
    const adherence = adherenceForDay(medications, day);
    const symptom = weeklySymptomSummary(symptoms);
    return { slot, dueNow, adherence, symptom };
  }, [medications, symptoms]);

  return (
    <View style={styles.root}>
      <FlatList
        data={MENU}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        keyExtractor={i => i.key}
        ListHeaderComponent={
          <AppCard>
            <Text style={styles.cardTitle}>Today Dashboard</Text>
            <Text style={styles.dashboardText}>Current slot: {dashboard.slot}</Text>
            <Text style={styles.dashboardText}>Due now medications: {dashboard.dueNow}</Text>
            <Text style={styles.dashboardText}>Medication adherence today: {dashboard.adherence}%</Text>
            <Text style={styles.dashboardText}>
              Weekly symptoms: pain {dashboard.symptom.avgPain}, fatigue {dashboard.symptom.avgFatigue}, sleep {dashboard.symptom.avgSleep}h
            </Text>
          </AppCard>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.tile} onPress={() => navigation.navigate(item.key)}>
            <View style={styles.icon}>
              <Text style={styles.iconTxt}>{item.icon}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, gap: 12 },
  row: { gap: 12 },
  tile: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FCE7DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconTxt: { fontSize: 24 },
  title: { fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  cardTitle: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  dashboardText: { marginTop: 6, color: COLORS.text },
});
