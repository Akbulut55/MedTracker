import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';

export function HelpScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.h}>MedTracker Help</Text>
        <Text style={styles.t}>- Profile: theme, font size, accent, clear local data</Text>
        <Text style={styles.t}>- Trainings: read-only educational content</Text>
        <Text style={styles.t}>- Reminders: add/delete reminder cards</Text>
        <Text style={styles.t}>- Notes: add/open/delete notes</Text>
        <Text style={styles.t}>- Exercise: save and review nutrition/exercise records</Text>
        <Text style={styles.t}>- Info Sharing: like topics and add comments</Text>
        <Text style={styles.t}>- Suggestions: react with like/dislike</Text>
        <Text style={styles.t}>- Ratings: submit and view ratings list</Text>
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
