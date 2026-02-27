import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';

export function PlaceholderScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.h}>UI is ready</Text>
        <Text style={styles.p}>
          This screen is a placeholder. Next we’ll implement the real UI (lists/forms) exactly like the screenshots.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md, justifyContent: 'center' },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  h: { fontWeight: '900', color: COLORS.text, fontSize: 18 },
  p: { marginTop: 10, color: COLORS.muted, lineHeight: 20 },
});