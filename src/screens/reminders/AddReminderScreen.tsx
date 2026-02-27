import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'AddReminder'>;

export function AddReminderScreen({ navigation }: Props) {
  const { addReminder } = useData();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [module, setModule] = useState('Diary');

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <Text style={[styles.label, { marginTop: 10 }]}>Detail</Text>
        <TextInput value={detail} onChangeText={setDetail} style={[styles.input, { minHeight: 100 }]} multiline />

        <Text style={[styles.label, { marginTop: 10 }]}>Module</Text>
        <TextInput value={module} onChangeText={setModule} style={styles.input} />

        <Pressable
          style={[styles.btn, (!title.trim() || !detail.trim()) && { opacity: 0.6 }]}
          disabled={!title.trim() || !detail.trim()}
          onPress={() => {
            addReminder(title.trim(), detail.trim(), module.trim());
            navigation.goBack();
          }}
        >
          <Text style={styles.btnTxt}>SAVE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  label: { fontWeight: '800', color: COLORS.muted },
  input: { marginTop: 6, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 10 },
  btn: { marginTop: 14, backgroundColor: COLORS.brand, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: 'white', fontWeight: '900' },
});