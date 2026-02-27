import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';
import { useSettings } from '../../state/SettingsContext';

const ACCENTS = ['#C4532E', '#2F6FDB', '#16A34A', '#6D28D9'];

export function ProfileScreen() {
  const { darkMode, setDarkMode, fontScale, setFontScale, accent, setAccent } = useSettings();
  const [about, setAbout] = useState('');

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={[styles.h, { fontSize: 18 * fontScale }]}>Kendinle İlgili Bir Şeyler Yaz</Text>
        <TextInput
          value={about}
          onChangeText={setAbout}
          multiline
          placeholder="..."
          style={[styles.textArea, { fontSize: 14 * fontScale }]}
        />
        <Pressable style={[styles.btn, { backgroundColor: accent }]} onPress={() => {}}>
          <Text style={styles.btnTxt}>KAYDET</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: 14 * fontScale }]}>Gece Modunu Etkinleştir</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <Text style={[styles.label, { marginTop: 10, fontSize: 14 * fontScale }]}>Yazı Boyutu</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <Pressable style={[styles.smallBtn, { backgroundColor: accent }]} onPress={() => setFontScale(fontScale - 0.05)}>
            <Text style={styles.btnTxt}>A-</Text>
          </Pressable>
          <Pressable style={[styles.smallBtn, { backgroundColor: accent }]} onPress={() => setFontScale(fontScale + 0.05)}>
            <Text style={styles.btnTxt}>A+</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, { marginTop: 10, fontSize: 14 * fontScale }]}>Tema Seçimi</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          {ACCENTS.map(c => (
            <Pressable
              key={c}
              onPress={() => setAccent(c)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: c,
                borderWidth: c === accent ? 3 : 1,
                borderColor: c === accent ? '#111827' : COLORS.border,
              }}
            />
          ))}
        </View>

        <Pressable style={[styles.btn, { backgroundColor: COLORS.danger, marginTop: 14 }]} onPress={() => {}}>
          <Text style={styles.btnTxt}>TÜM VERİLERİ SİL</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.md, gap: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  h: { fontWeight: '900', color: COLORS.text },
  label: { fontWeight: '800', color: COLORS.muted },
  textArea: {
    marginTop: 8,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  btn: { marginTop: 10, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  smallBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnTxt: { color: 'white', fontWeight: '900' },
});