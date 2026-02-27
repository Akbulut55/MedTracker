import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

export function DiaryRecordsScreen() {
  const { diary } = useData();

  return (
    <View style={styles.root}>
      <FlatList
        data={diary}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        ListEmptyComponent={<Text style={{ color: COLORS.muted, padding: SPACING.md }}>No records yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.h}>{item.date}</Text>
            <Text style={styles.t}>Pain: {item.pain}</Text>
            <Text style={styles.t}>Fatigue: {item.fatigue}</Text>
            <Text style={styles.t}>Appetite: {item.appetite ? 'Yes' : 'No'}</Text>
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
});