import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';
import { useSettings } from '../../state/SettingsContext';
import { useData } from '../../state/DataContext';
import { AppButton } from '../../components/ui/AppButton';
import { confirmAction, showError, showSuccess } from '../../utils/feedback';
import { isValidTimeInput, maskTimeInput } from '../../utils/masks';

const ACCENTS = ['#C4532E', '#2F6FDB', '#16A34A', '#B45309'];
const todayKey = () => new Date().toISOString().slice(0, 10);

function ProgressRing({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const ringColor = pct >= 100 ? '#15803D' : COLORS.brand;
  return (
    <View style={styles.ringWrap}>
      <View style={[styles.ring, { borderColor: ringColor }]}>
        <Text style={styles.ringValue}>{pct}%</Text>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
}

export function ProfileScreen() {
  const { darkMode, setDarkMode, fontScale, setFontScale, accent, setAccent, goals, setGoals, notifications, setNotifications, resetSettings } =
    useSettings();
  const { clearAllData, resetModuleData, exportBackupJSON, importBackupJSON, exercise, symptoms } = useData();
  const [backupText, setBackupText] = useState('');
  const [backupError, setBackupError] = useState('');

  const today = todayKey();
  const todayExercise = exercise.filter(e => e.dateKey === today).reduce((sum, e) => sum + e.minutes, 0);
  const todaySymptom = symptoms.find(s => s.dateKey === today);
  const sleepProgress = ((todaySymptom?.sleepHours ?? 0) / goals.sleepHours) * 100;
  const exerciseProgress = (todayExercise / goals.exerciseMinutes) * 100;
  const painProgress = todaySymptom ? (goals.maxPain / Math.max(1, todaySymptom.pain)) * 100 : 0;
  const fatigueProgress = todaySymptom ? (goals.maxFatigue / Math.max(1, todaySymptom.fatigue)) * 100 : 0;
  const badges: string[] = [];
  if (exerciseProgress >= 100) badges.push('Exercise Goal');
  if (sleepProgress >= 100) badges.push('Sleep Goal');
  if (painProgress >= 100) badges.push('Pain Control');
  if (fatigueProgress >= 100) badges.push('Fatigue Control');
  if (badges.length === 4) badges.push('Perfect Day');

  const updateGoal = (key: keyof typeof goals, delta: number, min = 0, max = 120) => {
    const next = Math.max(min, Math.min(max, goals[key] + delta));
    setGoals({ ...goals, [key]: next });
  };

  const timeErrors = useMemo(() => {
    const values = Object.values(notifications.slotTimes);
    const hasSlotError = values.some(v => !isValidTimeInput(v));
    const quietStartOk = isValidTimeInput(notifications.quietStart);
    const quietEndOk = isValidTimeInput(notifications.quietEnd);
    return { hasSlotError, quietStartOk, quietEndOk };
  }, [notifications]);

  const updateSlotTime = (slot: keyof typeof notifications.slotTimes, value: string) => {
    setNotifications({
      ...notifications,
      slotTimes: { ...notifications.slotTimes, [slot]: maskTimeInput(value) },
    });
  };

  const resetModule = (module: Parameters<typeof resetModuleData>[0], label: string) => {
    confirmAction(`Reset ${label}`, `${label} verileri silinsin mi?`, () => {
      resetModuleData(module);
      showSuccess(`${label} resetlendi.`);
    });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: 14 * fontScale }]}>Dark mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <Text style={[styles.label, styles.mt10, { fontSize: 14 * fontScale }]}>Font size</Text>
        <View style={styles.rowBtns}>
          <Pressable style={[styles.smallBtn, { backgroundColor: accent }]} onPress={() => setFontScale(fontScale - 0.05)}>
            <Text style={styles.btnTxt}>A-</Text>
          </Pressable>
          <Pressable style={[styles.smallBtn, { backgroundColor: accent }]} onPress={() => setFontScale(fontScale + 0.05)}>
            <Text style={styles.btnTxt}>A+</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, styles.mt10, { fontSize: 14 * fontScale }]}>Accent color</Text>
        <View style={styles.rowBtns}>
          {ACCENTS.map(c => (
            <Pressable
              key={c}
              onPress={() => setAccent(c)}
              style={[styles.colorDot, { backgroundColor: c, borderWidth: c === accent ? 3 : 1, borderColor: c === accent ? '#111827' : COLORS.border }]}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.goalTitle}>Daily Health Goals</Text>
        <View style={styles.goalRow}>
          <Text style={styles.label}>Sleep target: {goals.sleepHours}h</Text>
          <View style={styles.goalBtns}>
            <AppButton title="-" variant="secondary" onPress={() => updateGoal('sleepHours', -1, 1, 16)} />
            <AppButton title="+" variant="secondary" onPress={() => updateGoal('sleepHours', 1, 1, 16)} />
          </View>
        </View>
        <View style={styles.goalRow}>
          <Text style={styles.label}>Exercise target: {goals.exerciseMinutes}m</Text>
          <View style={styles.goalBtns}>
            <AppButton title="-" variant="secondary" onPress={() => updateGoal('exerciseMinutes', -5, 5, 180)} />
            <AppButton title="+" variant="secondary" onPress={() => updateGoal('exerciseMinutes', 5, 5, 180)} />
          </View>
        </View>
        <View style={styles.goalRow}>
          <Text style={styles.label}>Max pain goal: {goals.maxPain}</Text>
          <View style={styles.goalBtns}>
            <AppButton title="-" variant="secondary" onPress={() => updateGoal('maxPain', -1, 1, 10)} />
            <AppButton title="+" variant="secondary" onPress={() => updateGoal('maxPain', 1, 1, 10)} />
          </View>
        </View>
        <View style={styles.goalRow}>
          <Text style={styles.label}>Max fatigue goal: {goals.maxFatigue}</Text>
          <View style={styles.goalBtns}>
            <AppButton title="-" variant="secondary" onPress={() => updateGoal('maxFatigue', -1, 1, 10)} />
            <AppButton title="+" variant="secondary" onPress={() => updateGoal('maxFatigue', 1, 1, 10)} />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.goalTitle}>Notification Settings</Text>
        {(['Morning', 'Noon', 'Evening', 'Night'] as const).map(slot => (
          <View key={slot} style={styles.timeRow}>
            <Text style={styles.label}>{slot}</Text>
            <TextInput
              style={styles.timeInput}
              value={notifications.slotTimes[slot]}
              onChangeText={value => updateSlotTime(slot, value)}
              placeholder="HH:MM"
              keyboardType="number-pad"
            />
          </View>
        ))}
        {timeErrors.hasSlotError ? <Text style={styles.error}>Slot saat formati HH:MM olmalidir.</Text> : null}
        <View style={[styles.row, styles.mt10]}>
          <Text style={styles.label}>Quiet hours</Text>
          <Switch
            value={notifications.quietHoursEnabled}
            onValueChange={v => setNotifications({ ...notifications, quietHoursEnabled: v })}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.label}>Quiet start</Text>
          <TextInput
            style={styles.timeInput}
            value={notifications.quietStart}
            onChangeText={value => setNotifications({ ...notifications, quietStart: maskTimeInput(value) })}
            placeholder="HH:MM"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.label}>Quiet end</Text>
          <TextInput
            style={styles.timeInput}
            value={notifications.quietEnd}
            onChangeText={value => setNotifications({ ...notifications, quietEnd: maskTimeInput(value) })}
            placeholder="HH:MM"
            keyboardType="number-pad"
          />
        </View>
        {!timeErrors.quietStartOk || !timeErrors.quietEndOk ? <Text style={styles.error}>Quiet saatleri HH:MM olmalidir.</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.goalTitle}>Today Progress</Text>
        <View style={styles.ringRow}>
          <ProgressRing label="Sleep" value={sleepProgress} />
          <ProgressRing label="Exercise" value={exerciseProgress} />
        </View>
        <View style={styles.ringRow}>
          <ProgressRing label="Pain Goal" value={painProgress} />
          <ProgressRing label="Fatigue Goal" value={fatigueProgress} />
        </View>
        <Text style={[styles.label, styles.mt10]}>Badges</Text>
        {badges.length === 0 ? <Text style={styles.badgeNone}>No badges yet today.</Text> : null}
        <View style={styles.badgeRow}>
          {badges.map(b => (
            <View key={b} style={styles.badge}>
              <Text style={styles.badgeTxt}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.goalTitle}>Module Reset</Text>
        <View style={styles.moduleGrid}>
          <AppButton title="Reminders" variant="secondary" onPress={() => resetModule('reminders', 'Reminders')} />
          <AppButton title="Notes" variant="secondary" onPress={() => resetModule('notes', 'Notes')} />
          <AppButton title="Exercise" variant="secondary" onPress={() => resetModule('exercise', 'Exercise')} />
          <AppButton title="Meds" variant="secondary" onPress={() => resetModule('medications', 'Medications')} />
          <AppButton title="Symptoms" variant="secondary" onPress={() => resetModule('symptoms', 'Symptoms')} />
          <AppButton title="Ratings" variant="secondary" onPress={() => resetModule('ratings', 'Ratings')} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.goalTitle}>Backup / Import JSON</Text>
        <View style={styles.rowBtns}>
          <AppButton
            title="Create Backup"
            variant="secondary"
            onPress={() => {
              setBackupText(exportBackupJSON());
              setBackupError('');
              showSuccess('Backup JSON created.');
            }}
          />
          <AppButton
            title="Import Backup"
            variant="secondary"
            onPress={() => {
              const result = importBackupJSON(backupText.trim());
              if (!result.ok) {
                setBackupError(result.error);
                showError(result.error);
                return;
              }
              setBackupError('');
              showSuccess('Backup imported successfully.');
            }}
          />
        </View>
        <TextInput
          multiline
          value={backupText}
          onChangeText={setBackupText}
          style={styles.backupInput}
          placeholder="Backup JSON burada olusturulur veya buraya yapistirilir..."
        />
        {backupError ? <Text style={styles.error}>{backupError}</Text> : null}
      </View>

      <Pressable
        style={[styles.btn, { backgroundColor: COLORS.danger }]}
        onPress={() =>
          confirmAction('Delete all data', 'This clears local app data and resets settings.', () => {
            clearAllData();
            resetSettings();
            showSuccess('All data deleted.');
          })
        }
      >
        <Text style={styles.btnTxt}>Delete All Data</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.md, gap: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  label: { fontWeight: '800', color: COLORS.muted },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  mt10: { marginTop: 10 },
  rowBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { marginTop: 2, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  smallBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: 'white', fontWeight: '900' },
  colorDot: { width: 34, height: 34, borderRadius: 17 },
  goalTitle: { fontWeight: '900', color: COLORS.text, fontSize: 16 },
  goalRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  goalBtns: { flexDirection: 'row', gap: 8, width: 110 },
  timeRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  timeInput: {
    width: 96,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.text,
  },
  error: { marginTop: 8, color: COLORS.danger, fontWeight: '700' },
  ringRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  ringWrap: { alignItems: 'center', width: '48%' },
  ring: { width: 70, height: 70, borderRadius: 35, borderWidth: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  ringValue: { fontWeight: '900', color: COLORS.text },
  ringLabel: { marginTop: 6, color: COLORS.muted, fontWeight: '700' },
  badgeRow: { marginTop: 8, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC', borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  badgeTxt: { color: '#166534', fontWeight: '800', fontSize: 12 },
  badgeNone: { marginTop: 6, color: COLORS.muted },
  moduleGrid: { marginTop: 10, gap: 8 },
  backupInput: {
    marginTop: 10,
    minHeight: 110,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: COLORS.text,
  },
});
