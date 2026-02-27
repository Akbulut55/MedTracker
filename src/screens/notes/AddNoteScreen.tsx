import React, { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'AddNote'>;

export function AddNoteScreen({ navigation }: Props) {
  const { addNote } = useData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const valid = title.trim().length > 0 && content.trim().length > 0;

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
          title="Save"
          disabled={!valid}
          onPress={() => {
            addNote(title.trim(), content.trim());
            showSuccess('Note added.');
            navigation.goBack();
          }}
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
  multi: { minHeight: 140, textAlignVertical: 'top' },
  error: { marginTop: 6, color: COLORS.danger, fontWeight: '700' },
});
