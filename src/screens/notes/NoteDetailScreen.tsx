import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { confirmAction, showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'NoteDetail'>;

export function NoteDetailScreen({ route, navigation }: Props) {
  const { notes, deleteNote } = useData();
  const note = useMemo(() => notes.find(n => n.id === route.params.id), [notes, route.params.id]);

  if (!note) {
    return (
      <ScreenContainer padded>
        <Text style={styles.empty}>Note not found.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.meta}>{note.createdAt}</Text>
          <Text style={styles.body}>{note.content}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <AppButton title="Edit" variant="secondary" onPress={() => navigation.navigate('EditNote', { id: note.id })} />
            </View>
            <View style={styles.col}>
              <AppButton
                title="Delete"
                variant="danger"
                onPress={() =>
                  confirmAction('Delete note', `${note.title} silinsin mi?`, () => {
                    deleteNote(note.id);
                    showSuccess('Note deleted.');
                    navigation.goBack();
                  })
                }
              />
            </View>
          </View>
        </AppCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md },
  title: { fontWeight: '900', color: COLORS.text, fontSize: 18 },
  meta: { marginTop: 6, color: COLORS.muted, fontSize: 12 },
  body: { marginTop: 12, color: COLORS.text, lineHeight: 20 },
  row: { marginTop: 14, flexDirection: 'row', gap: 10 },
  col: { flex: 1 },
  empty: { color: COLORS.muted },
});
