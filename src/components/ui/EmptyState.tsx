import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';

export function EmptyState({ text }: { text: string }) {
  return <Text style={styles.txt}>{text}</Text>;
}

const styles = StyleSheet.create({
  txt: { color: COLORS.muted, padding: SPACING.md },
});
