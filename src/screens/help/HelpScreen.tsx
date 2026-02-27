import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';

export function HelpScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.h}>MedTracker Help</Text>
        <Text style={styles.t}>• Profile: theme, font size</Text>
        <Text style={styles.t}>• Trainings: read education content</Text>
        <Text style={styles.t}>• Reminders: admin can add reminders</Text>
        <Text style={styles.t}>• Diary / Exercise: save daily tracking</Text>
        <Text style={styles.t}>• Info Sharing: like + comments</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  h: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  t: { marginTop: 8, color: COLORS.text },
});