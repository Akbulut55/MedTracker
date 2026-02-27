import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { MedicationSlot, useData } from '../../state/DataContext';
import { COLORS } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'EditMedication'>;
const SLOTS: MedicationSlot[] = ['Morning', 'Noon', 'Evening', 'Night'];

export function EditMedicationScreen({ navigation, route }: Props) {
  const { medications, updateMedication } = useData();
  const medication = useMemo(() => medications.find(m => m.id === route.params.id), [medications, route.params.id]);
  const [name, setName] = useState(medication?.name ?? '');
  const [dose, setDose] = useState(medication?.dose ?? '');
  const [frequency, setFrequency] = useState(medication?.frequency ?? '');
  const [slots, setSlots] = useState<MedicationSlot[]>(medication?.slots ?? ['Morning']);
  const valid = !!medication && name.trim().length > 0 && dose.trim().length > 0 && frequency.trim().length > 0 && slots.length > 0;
  const showErrors = !valid;

  const toggleSlot = (slot: MedicationSlot) => {
    setSlots(prev => (prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]));
  };

  if (!medication) {
    return (
      <View style={styles.notFoundWrap}>
        <Text style={styles.notFoundTxt}>Medication not found.</Text>
      </View>
    );
  }

  return (
    <ScreenContainer padded>
      <AppCard>
        <Text style={styles.label}>Medication name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
        {showErrors && !name.trim() ? <Text style={styles.error}>Name is required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Dose</Text>
        <TextInput value={dose} onChangeText={setDose} style={styles.input} />
        {showErrors && !dose.trim() ? <Text style={styles.error}>Dose is required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Frequency</Text>
        <TextInput value={frequency} onChangeText={setFrequency} style={styles.input} />
        {showErrors && !frequency.trim() ? <Text style={styles.error}>Frequency is required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Reminder time slots</Text>
        <View style={styles.row}>
          {SLOTS.map(slot => (
            <Pressable key={slot} onPress={() => toggleSlot(slot)} style={[styles.pill, slots.includes(slot) && styles.pillOn]}>
              <Text style={[styles.pillTxt, slots.includes(slot) && styles.pillTxtOn]}>{slot}</Text>
            </Pressable>
          ))}
        </View>
        {showErrors && slots.length === 0 ? <Text style={styles.error}>Choose at least one slot.</Text> : null}

        <Text style={styles.spaced} />
        <AppButton
          title="Save Changes"
          disabled={!valid}
          onPress={() => {
            updateMedication(medication.id, name.trim(), dose.trim(), frequency.trim(), slots);
            showSuccess('Medication updated.');
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
  row: { marginTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  pillOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  pillTxt: { color: COLORS.text, fontWeight: '800' },
  pillTxtOn: { color: 'white' },
  error: { marginTop: 6, color: COLORS.danger, fontWeight: '700' },
  notFoundWrap: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  notFoundTxt: { color: COLORS.muted },
});
