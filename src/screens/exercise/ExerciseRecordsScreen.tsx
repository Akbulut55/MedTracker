import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

export function ExerciseRecordsScreen() {
  const { exercise, deleteExerciseEntry } = useData();

  return (
    <View style={styles.root}>
      <FlatList
        data={exercise}
        keyExtractor={x => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No records yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.h}>{item.date}</Text>
            <Text style={styles.t}>Vegetables: {item.vegGrams}g</Text>
            <Text style={styles.t}>Fruits: {item.fruitGrams}g</Text>
            <Text style={styles.t}>Minutes: {item.minutes}</Text>
            <Text style={styles.t}>Types: {item.types.length ? item.types.join(', ') : 'None'}</Text>
            <Text style={styles.t}>Felt bad: {item.feltBad ? 'Yes' : 'No'}</Text>
            <Pressable style={styles.del} onPress={() => deleteExerciseEntry(item.id)}>
              <Text style={styles.delTxt}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  h: { fontWeight: '900', color: COLORS.text },
  t: { marginTop: 6, color: COLORS.text },
  del: { marginTop: 10, backgroundColor: COLORS.danger, borderRadius: 10, alignItems: 'center', paddingVertical: 8 },
  delTxt: { color: 'white', fontWeight: '900' },
  empty: { color: COLORS.muted, padding: SPACING.md },
});
