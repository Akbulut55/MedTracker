import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'NoteDetail'>;

export function NoteDetailScreen({ route, navigation }: Props) {
  const { notes, deleteNote } = useData();
  const note = useMemo(() => notes.find(n => n.id === route.params.id), [notes, route.params.id]);

  if (!note) {
    return (
      <View style={styles.root}>
        <Text style={styles.empty}>Note not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: SPACING.md }}>
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.meta}>{note.createdAt}</Text>
        <Text style={styles.body}>{note.content}</Text>

        <Pressable
          style={styles.del}
          onPress={() => {
            deleteNote(note.id);
            navigation.goBack();
          }}
        >
          <Text style={styles.delTxt}>Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 18 },
  meta: { marginTop: 6, color: COLORS.muted, fontSize: 12 },
  body: { marginTop: 12, color: COLORS.text, lineHeight: 20 },
  del: { marginTop: 14, backgroundColor: COLORS.danger, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  delTxt: { color: 'white', fontWeight: '900' },
  empty: { color: COLORS.muted, padding: SPACING.md },
});
