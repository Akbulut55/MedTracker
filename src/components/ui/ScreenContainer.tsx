import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../app/theme';
import { SPACING } from '../../app/theme';

export function ScreenContainer({ children, padded = false }: { children: React.ReactNode; padded?: boolean }) {
  return <View style={[styles.root, padded && styles.padded]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  padded: { padding: SPACING.md },
});
