import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { AppButton } from '../../components/ui/AppButton';
import { confirmAction, showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'ExerciseRecords'>;

export function ExerciseRecordsScreen({ navigation }: Props) {
  const { exercise, deleteExerciseEntry } = useData();

  return (
    <ScreenContainer>
      <FlatList
        data={exercise}
        keyExtractor={x => x.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState text="No records yet." />}
        renderItem={({ item }) => (
          <AppCard>
            <Text style={styles.h}>{item.date}</Text>
            <Text style={styles.t}>Vegetables: {item.vegGrams}g</Text>
            <Text style={styles.t}>Fruits: {item.fruitGrams}g</Text>
            <Text style={styles.t}>Minutes: {item.minutes}</Text>
            <Text style={styles.t}>Types: {item.types.length ? item.types.join(', ') : 'None'}</Text>
            <Text style={styles.t}>Felt bad: {item.feltBad ? 'Yes' : 'No'}</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <AppButton title="Edit" variant="secondary" onPress={() => navigation.navigate('EditExercise', { id: item.id })} />
              </View>
              <View style={styles.col}>
                <AppButton
                  title="Delete"
                  variant="danger"
                  onPress={() =>
                    confirmAction('Delete record', 'Bu kayit silinsin mi?', () => {
                      deleteExerciseEntry(item.id);
                      showSuccess('Record deleted.');
                    })
                  }
                />
              </View>
            </View>
          </AppCard>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: 12 },
  h: { fontWeight: '900', color: COLORS.text },
  t: { marginTop: 6, color: COLORS.text },
  row: { marginTop: 10, flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
});
