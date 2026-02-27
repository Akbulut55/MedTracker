import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { useData } from '../../state/DataContext';
import { COLORS, SPACING } from '../../app/theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Diary'>;

function StepNumber({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.stepRow}>
      <Pressable style={styles.stepBtn} onPress={() => onChange(Math.max(0, value - 1))}><Text style={styles.stepBtnTxt}>-</Text></Pressable>
      <Text style={styles.stepVal}>{value}</Text>
      <Pressable style={styles.stepBtn} onPress={() => onChange(Math.min(10, value + 1))}><Text style={styles.stepBtnTxt}>+</Text></Pressable>
    </View>
  );
}

export function DiaryScreen({ navigation }: Props) {
  const { addDiary } = useData();
  const [step, setStep] = useState(1);
  const [pain, setPain] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const [appetite, setAppetite] = useState(true);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        {step === 1 && (
          <>
            <Text style={styles.q}>Rate your pain (0–10)</Text>
            <StepNumber value={pain} onChange={setPain} />
            <Pressable style={styles.btn} onPress={() => setStep(2)}><Text style={styles.btnTxt}>NEXT</Text></Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.q}>Rate your fatigue (0–10)</Text>
            <StepNumber value={fatigue} onChange={setFatigue} />
            <Pressable style={styles.btn} onPress={() => setStep(3)}><Text style={styles.btnTxt}>NEXT</Text></Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.q}>Did you have appetite today?</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable style={[styles.pill, appetite && styles.pillOn]} onPress={() => setAppetite(true)}>
                <Text style={[styles.pillTxt, appetite && { color: 'white' }]}>YES</Text>
              </Pressable>
              <Pressable style={[styles.pill, !appetite && styles.pillOn]} onPress={() => setAppetite(false)}>
                <Text style={[styles.pillTxt, !appetite && { color: 'white' }]}>NO</Text>
              </Pressable>
            </View>

            <Pressable
              style={[styles.btn, { marginTop: 14 }]}
              onPress={() => {
                addDiary(pain, fatigue, appetite);
                navigation.navigate('DiaryRecords');
              }}
            >
              <Text style={styles.btnTxt}>SAVE</Text>
            </Pressable>
          </>
        )}

        <Pressable onPress={() => navigation.navigate('DiaryRecords')} style={{ marginTop: 12 }}>
          <Text style={{ color: COLORS.brand, fontWeight: '900', textAlign: 'center' }}>View Records</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  q: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  btn: { marginTop: 14, backgroundColor: COLORS.brand, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: 'white', fontWeight: '900' },

  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 18 },
  stepBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.brand, alignItems: 'center', justifyContent: 'center' },
  stepBtnTxt: { color: 'white', fontWeight: '900', fontSize: 20 },
  stepVal: { fontSize: 42, fontWeight: '900', color: COLORS.brandDark },

  pill: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: 'white' },
  pillOn: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  pillTxt: { fontWeight: '900', color: COLORS.text },
});