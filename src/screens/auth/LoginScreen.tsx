import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, SPACING } from '../../app/theme';
import { useAuth } from '../../state/AuthContext';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('mm1');
  const [password, setPassword] = useState('1234');

  return (
    <View style={styles.root}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>MedTracker</Text>
        <Text style={styles.bannerSub}>Medication & Health Tracking</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput value={username} onChangeText={setUsername} style={styles.input} />

        <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

        <Text
          onPress={() => {
            const ok = signIn(username.trim(), password);
            if (!ok) Alert.alert('Error', 'Wrong username or password.');
          }}
          style={styles.btn}
        >
          SIGN IN
        </Text>

        <Text style={styles.hint}>Admin: admin / admin</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING.lg, justifyContent: 'center' },
  banner: { backgroundColor: COLORS.brand, borderRadius: 14, padding: 16, marginBottom: 16 },
  bannerTitle: { color: 'white', fontWeight: '900', textAlign: 'center', fontSize: 26 },
  bannerSub: { color: 'white', fontWeight: '700', textAlign: 'center', marginTop: 6, opacity: 0.95 },

  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  label: { color: COLORS.muted, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'white' },

  btn: { marginTop: 14, backgroundColor: COLORS.brand, color: 'white', fontWeight: '900', textAlign: 'center', paddingVertical: 12, borderRadius: 10 },
  hint: { marginTop: 10, color: COLORS.muted, textAlign: 'center', fontSize: 12 },
});