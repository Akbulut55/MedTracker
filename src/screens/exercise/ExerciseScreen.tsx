import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Exercise'>;

const TYPES = ['No exercise', 'Walk', 'Swim', 'Bike', 'Yoga', 'Other'];

export function ExerciseScreen({ navigation }: Props) {
  const { addExercise } = useData();
  const [veg, setVeg] = useState('150');
  const [fruit, setFruit] = useState('150');
  const [minutes, setMinutes] = useState('15');
  const [types, setTypes] = useState<string[]>(['Walk']);
  const [feltBad, setFeltBad] = useState(false);

  const toggle = (t: string) => setTypes(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));

  const ok = useMemo(() => Number(veg) >= 0 && Number(fruit) >= 0 && Number(minutes) >= 0, [veg, fruit, minutes]);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.label}>Vegetables (gr)</Text>
        <TextInput value={veg} onChangeText={setVeg} keyboardType="numeric" style={styles.input} />

        <Text style={[styles.label, { marginTop: 10 }]}>Fruits (gr)</Text>
        <TextInput value={fruit} onChangeText={setFruit} keyboardType="numeric" style={styles.input} />

        <Text style={[styles.label, { marginTop: 10 }]}>Exercise minutes</Text>
        <TextInput value={minutes} onChangeText={setMinutes} keyboardType="numeric" style={styles.input} />

        <Text style={[styles.label, { marginTop: 12 }]}>Exercise type (multi)</Text>
        <View style={{ gap: 8, marginTop: 8 }}>
          {TYPES.map(t => (
            <Pressable key={t} onPress={() => toggle(t)} style={[styles.choice, types.includes(t) && styles.choiceOn]}>
              <Text style={[styles.choiceTxt, types.includes(t) && { color: 'white' }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setFeltBad(v => !v)} style={[styles.choice, feltBad && styles.choiceOn, { marginTop: 10 }]}>
          <Text style={[styles.choiceTxt, feltBad && { color: 'white' }]}>Felt bad after exercise? {feltBad ? 'YES' : 'NO'}</Text>
        </Pressable>

        <Pressable
          disabled={!ok}
          style={[styles.btn, !ok && { opacity: 0.6 }]}
          onPress={() => {
            addExercise(Number(veg), Number(fruit), Number(minutes), types, feltBad);
            navigation.navigate('ExerciseRecords');
          }}
        >
          <Text style={styles.btnTxt}>SAVE</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ExerciseRecords')} style={{ marginTop: 12 }}>
          <Text style={{ color: COLORS.brand, fontWeight: '900', textAlign: 'center' }}>View Records</Text>
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
  choice: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 10, backgroundColor: 'white' },
  choiceOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  choiceTxt: { fontWeight: '800', color: COLORS.text },
  btn: { marginTop: 14, backgroundColor: COLORS.brand, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: 'white', fontWeight: '900' },
});