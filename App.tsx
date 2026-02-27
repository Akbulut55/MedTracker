import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';

import { AuthProvider } from './src/state/AuthContext';
import { SettingsProvider, useSettings } from './src/state/SettingsContext';
import { DataProvider } from './src/state/DataContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function AppInner() {
  const { darkMode } = useSettings();
  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
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