import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'AddNote'>;

export function AddNoteScreen({ navigation }: Props) {
  const { addNote } = useData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const valid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <Text style={[styles.label, { marginTop: 10 }]}>Content</Text>
        <TextInput value={content} onChangeText={setContent} style={[styles.input, styles.multi]} multiline />

        <Pressable
          style={[styles.btn, !valid && { opacity: 0.6 }]}
          disabled={!valid}
          onPress={() => {
            addNote(title.trim(), content.trim());
            navigation.goBack();
          }}
        >
          <Text style={styles.btnTxt}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  label: { fontWeight: '800', color: COLORS.muted },
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
  btn: { marginTop: 14, backgroundColor: COLORS.brand, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: 'white', fontWeight: '900' },
});
