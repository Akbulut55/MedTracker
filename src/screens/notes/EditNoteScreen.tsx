import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'EditNote'>;

export function EditNoteScreen({ navigation, route }: Props) {
  const { notes, updateNote } = useData();
  const note = useMemo(() => notes.find(n => n.id === route.params.id), [notes, route.params.id]);
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const valid = title.trim().length > 0 && content.trim().length > 0 && !!note;

  if (!note) return <View style={styles.notFoundWrap}><Text style={styles.notFoundTxt}>Note not found.</Text></View>;

  return (
    <ScreenContainer padded>
      <AppCard>
        <Text style={styles.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />
        {!title.trim() ? <Text style={styles.error}>Title is required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Content</Text>
        <TextInput value={content} onChangeText={setContent} style={[styles.input, styles.multi]} multiline />
        {!content.trim() ? <Text style={styles.error}>Content is required.</Text> : null}

        <Text style={styles.spaced} />
        <AppButton
          title="Save Changes"
          onPress={() => {
            updateNote(note.id, title.trim(), content.trim());
            showSuccess('Note updated.');
            navigation.goBack();
          }}
          disabled={!valid}
        />
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '800', color: COLORS.muted },
  spaced: { marginTop: 10 },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multi: { minHeight: 150, textAlignVertical: 'top' },
  error: { marginTop: 6, color: COLORS.danger, fontWeight: '700' },
  notFoundWrap: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  notFoundTxt: { color: COLORS.muted },
});
