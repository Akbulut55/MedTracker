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

type Props = NativeStackScreenProps<AppStackParamList, 'AddReminder'>;

export function AddReminderScreen({ navigation }: Props) {
  const { addReminder } = useData();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [module, setModule] = useState('');
  const valid = title.trim().length > 0 && detail.trim().length > 0;

  return (
    <ScreenContainer padded>
      <AppCard>
        <Text style={styles.label}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />
        {!title.trim() ? <Text style={styles.error}>Title is required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Detail</Text>
        <TextInput value={detail} onChangeText={setDetail} style={[styles.input, styles.multi]} multiline />
        {!detail.trim() ? <Text style={styles.error}>Detail is required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Category (optional)</Text>
        <TextInput value={module} onChangeText={setModule} style={styles.input} />

        <Text style={styles.spaced} />
        <AppButton
          title="Save"
          disabled={!valid}
          onPress={() => {
            addReminder(title.trim(), detail.trim(), module.trim() || undefined);
            showSuccess('Reminder added.');
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
  multi: { minHeight: 100, textAlignVertical: 'top' },
  error: { marginTop: 6, color: COLORS.danger, fontWeight: '700' },
});
