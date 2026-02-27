import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import notifee, { EventType } from '@notifee/react-native';

import { AuthProvider } from './src/state/AuthContext';
import { SettingsProvider, useSettings } from './src/state/SettingsContext';
import { DataProvider } from './src/state/DataContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { navigationRef, navigate } from './src/navigation/RootNavigation';

function AppInner() {
  const { darkMode } = useSettings();

  React.useEffect(() => {
    const unsub = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data?.screen === 'Medications') {
        navigate('Medications', undefined);
      }
    });

    notifee.getInitialNotification().then((initial) => {
      if (initial?.notification?.data?.screen === 'Medications') {
        setTimeout(() => navigate('Medications', undefined), 300);
      }
    });

    return () => unsub();
  }, []);

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
