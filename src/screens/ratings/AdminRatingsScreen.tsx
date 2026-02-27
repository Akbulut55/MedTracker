import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

export function AdminRatingsScreen() {
  const { ratings } = useData();

  const avg = useMemo(() => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b.stars, 0);
    return Math.round((sum / ratings.length) * 100) / 100;
  }, [ratings]);

  return (
    <View style={styles.root}>
      <FlatList
        data={ratings}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        ListHeaderComponent={
          <View style={[styles.card, { marginBottom: 12 }]}>
            <Text style={{ fontWeight: '900', color: COLORS.text }}>Average: {avg}</Text>
            <Text style={{ marginTop: 4, color: COLORS.muted }}>Total: {ratings.length}</Text>
          </View>
        }
        ListEmptyComponent={<Text style={{ color: COLORS.muted, padding: SPACING.md }}>No ratings yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.h}>{item.user}</Text>
            <Text style={styles.t}>Stars: {item.stars}</Text>
            <Text style={styles.meta}>{item.createdAt}</Text>
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
  meta: { marginTop: 8, color: COLORS.muted, fontSize: 12 },
});