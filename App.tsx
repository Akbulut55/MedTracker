import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthProvider } from './src/state/AuthContext';
import { SettingsProvider, useSettings } from './src/state/SettingsContext';
import { DataProvider, MedicationSlot, useData } from './src/state/DataContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { navigationRef, navigate } from './src/navigation/RootNavigation';
import { syncMedicationNotifications, scheduleSnoozeNotification } from './src/services/medicationNotifications';
import { COLORS } from './src/app/theme';
import { showSuccess } from './src/utils/feedback';

const PENDING_ACTIONS_KEY = 'medtracker_pending_actions_v1';

function AppInner() {
  const { darkMode, hydrated: settingsHydrated, notifications } = useSettings();
  const { hydrated: dataHydrated, medications, toggleMedicationTaken } = useData();

  const processAction = React.useCallback(
    async (action: string | undefined, medicationId: string | undefined, slot: string | undefined) => {
      if (!medicationId || !slot) return;
      const castSlot = slot as MedicationSlot;
      const medication = medications.find(m => m.id === medicationId);
      if (!medication) return;
      if (action === 'taken') {
        toggleMedicationTaken(medicationId, castSlot);
        showSuccess(`Marked taken: ${medication.name} (${castSlot})`);
      } else if (action === 'snooze') {
        await scheduleSnoozeNotification(medication.name, medication.dose, castSlot, medication.id);
        showSuccess(`Snoozed 10 minutes: ${medication.name}`);
      }
    },
    [medications, toggleMedicationTaken],
  );

  React.useEffect(() => {
    if (!dataHydrated || !settingsHydrated) return;
    syncMedicationNotifications(medications, notifications).catch(() => {});
  }, [dataHydrated, settingsHydrated, medications, notifications]);

  React.useEffect(() => {
    const unsub = notifee.onForegroundEvent(async ({ type, detail }) => {
      try {
        const data = detail.notification?.data;
        if (type === EventType.ACTION_PRESS) {
          await processAction(
            detail.pressAction?.id,
            data?.medicationId as string | undefined,
            data?.slot as string | undefined,
          );
        }
        if (type === EventType.PRESS && data?.screen === 'Medications') {
          navigate('Medications', undefined);
        }
      } catch {
        // Ignore foreground notification errors in release; keep app alive.
      }
    });

    notifee
      .getInitialNotification()
      .then(async initial => {
        const data = initial?.notification?.data;
        if (data?.screen === 'Medications') {
          setTimeout(() => navigate('Medications', undefined), 300);
        }
        await processAction(
          initial?.pressAction?.id,
          data?.medicationId as string | undefined,
          data?.slot as string | undefined,
        );
      })
      .catch(() => {});

    AsyncStorage.getItem(PENDING_ACTIONS_KEY)
      .then(async raw => {
        if (!raw) return;
        const queued: Array<{ action: string; medicationId: string; slot: string }> = JSON.parse(raw);
        for (const item of queued) {
          await processAction(item.action, item.medicationId, item.slot);
        }
        await AsyncStorage.removeItem(PENDING_ACTIONS_KEY);
      })
      .catch(async () => {
        await AsyncStorage.removeItem(PENDING_ACTIONS_KEY).catch(() => {});
      });

    return () => unsub();
  }, [processAction]);

  if (!settingsHydrated || !dataHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} theme={darkMode ? DarkTheme : DefaultTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <DataProvider>
            <AppInner />
          </DataProvider>
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
});
