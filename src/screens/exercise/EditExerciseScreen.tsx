import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS } from '../../app/theme';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { showSuccess } from '../../utils/feedback';

type Props = NativeStackScreenProps<AppStackParamList, 'EditExercise'>;
const TYPES = ['No exercise', 'Walk', 'Swim', 'Bike', 'Yoga', 'Other'];

export function EditExerciseScreen({ navigation, route }: Props) {
  const { exercise, updateExerciseEntry } = useData();
  const entry = useMemo(() => exercise.find(x => x.id === route.params.id), [exercise, route.params.id]);
  const [veg, setVeg] = useState(String(entry?.vegGrams ?? ''));
  const [fruit, setFruit] = useState(String(entry?.fruitGrams ?? ''));
  const [minutes, setMinutes] = useState(String(entry?.minutes ?? ''));
  const [types, setTypes] = useState<string[]>(entry?.types ?? []);
  const [feltBad, setFeltBad] = useState(entry?.feltBad ?? false);

  const toggle = (t: string) => setTypes(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));
  const valid =
    !!entry &&
    veg.trim().length > 0 &&
    fruit.trim().length > 0 &&
    minutes.trim().length > 0 &&
    Number(veg) >= 0 &&
    Number(fruit) >= 0 &&
    Number(minutes) >= 0;

  if (!entry) return <View style={styles.notFoundWrap}><Text style={styles.notFoundTxt}>Record not found.</Text></View>;

  return (
    <ScreenContainer padded>
      <AppCard>
        <Text style={styles.label}>Vegetables (grams)</Text>
        <TextInput value={veg} onChangeText={setVeg} keyboardType="numeric" style={styles.input} />
        {!veg.trim() ? <Text style={styles.error}>Vegetable grams are required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Fruits (grams)</Text>
        <TextInput value={fruit} onChangeText={setFruit} keyboardType="numeric" style={styles.input} />
        {!fruit.trim() ? <Text style={styles.error}>Fruit grams are required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Exercise minutes</Text>
        <TextInput value={minutes} onChangeText={setMinutes} keyboardType="numeric" style={styles.input} />
        {!minutes.trim() ? <Text style={styles.error}>Minutes are required.</Text> : null}

        <Text style={[styles.label, styles.spaced]}>Exercise type</Text>
        <View style={styles.typeWrap}>
          {TYPES.map(t => (
            <Pressable key={t} onPress={() => toggle(t)} style={[styles.choice, types.includes(t) && styles.choiceOn]}>
              <Text style={[styles.choiceTxt, types.includes(t) && styles.choiceTxtOn]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setFeltBad(v => !v)} style={[styles.choice, styles.spaced, feltBad && styles.choiceOn]}>
          <Text style={[styles.choiceTxt, feltBad && styles.choiceTxtOn]}>Felt bad after exercise: {feltBad ? 'Yes' : 'No'}</Text>
        </Pressable>

        <Text style={styles.spaced} />
        <AppButton
          title="Save Changes"
          disabled={!valid}
          onPress={() => {
            updateExerciseEntry(entry.id, Number(veg), Number(fruit), Number(minutes), types, feltBad);
            showSuccess('Exercise record updated.');
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
  typeWrap: { gap: 8, marginTop: 8 },
  choice: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 10, backgroundColor: 'white' },
  choiceOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  choiceTxt: { fontWeight: '800', color: COLORS.text },
  choiceTxtOn: { color: 'white' },
  error: { marginTop: 6, color: COLORS.danger, fontWeight: '700' },
  notFoundWrap: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  notFoundTxt: { color: COLORS.muted },
});
