import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, RADIUS } from '../../app/theme';

export function AppCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
});
