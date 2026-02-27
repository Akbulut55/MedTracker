import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

export function SuggestionsScreen() {
  const { suggestions, reactSuggestion } = useData();

  return (
    <View style={styles.root}>
      <FlatList
        data={suggestions}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: SPACING.md, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.meta}>admin • {item.createdAt}</Text>
            <Text style={styles.body}>{item.text}</Text>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Pressable style={styles.reaction} onPress={() => reactSuggestion(item.id, 1, 0)}>
                <Text style={styles.reactionTxt}>👍 {item.likes}</Text>
              </Pressable>
              <Pressable style={styles.reaction} onPress={() => reactSuggestion(item.id, 0, 1)}>
                <Text style={styles.reactionTxt}>👎 {item.dislikes}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  meta: { color: COLORS.muted, fontSize: 12, fontWeight: '800' },
  body: { marginTop: 8, color: COLORS.text, fontWeight: '800' },
  reaction: { backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
  reactionTxt: { fontWeight: '900', color: COLORS.text },
});