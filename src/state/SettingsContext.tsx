import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MedicationSlot } from './DataContext';

export type HealthGoals = {
  sleepHours: number;
  exerciseMinutes: number;
  maxPain: number;
  maxFatigue: number;
};

export type NotificationSettings = {
  slotTimes: Record<MedicationSlot, string>;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
};

type SettingsCtx = {
  darkMode: boolean;
  fontScale: number;
  accent: string;
  goals: HealthGoals;
  notifications: NotificationSettings;
  hydrated: boolean;
  setDarkMode: (v: boolean) => void;
  setFontScale: (v: number) => void;
  setAccent: (v: string) => void;
  setGoals: (goals: HealthGoals) => void;
  setNotifications: (value: NotificationSettings) => void;
  resetSettings: () => void;
};

const Ctx = createContext<SettingsCtx | null>(null);
const STORAGE_KEY = 'medtracker_settings_v1';

type PersistedSettings = {
  darkMode: boolean;
  fontScale: number;
  accent: string;
  goals: HealthGoals;
  notifications: NotificationSettings;
};

const defaultGoals: HealthGoals = {
  sleepHours: 7,
  exerciseMinutes: 30,
  maxPain: 4,
  maxFatigue: 4,
};

const defaultNotifications: NotificationSettings = {
  slotTimes: {
    Morning: '08:00',
    Noon: '12:00',
    Evening: '18:00',
    Night: '22:00',
  },
  quietHoursEnabled: false,
  quietStart: '23:00',
  quietEnd: '06:00',
};

const defaultSettings: PersistedSettings = {
  darkMode: false,
  fontScale: 1,
  accent: '#C4532E',
  goals: defaultGoals,
  notifications: defaultNotifications,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(defaultSettings.darkMode);
  const [fontScale, setFontScaleState] = useState(defaultSettings.fontScale);
  const [accent, setAccent] = useState(defaultSettings.accent);
  const [goals, setGoals] = useState<HealthGoals>(defaultSettings.goals);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultSettings.notifications);
  const [hydrated, setHydrated] = useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: PersistedSettings = JSON.parse(raw);
          setDarkMode(parsed.darkMode ?? defaultSettings.darkMode);
          setFontScaleState(parsed.fontScale ?? defaultSettings.fontScale);
          setAccent(parsed.accent ?? defaultSettings.accent);
          setGoals(parsed.goals ?? defaultSettings.goals);
          setNotifications(parsed.notifications ?? defaultSettings.notifications);
        }
      } catch {
        // Keep defaults on read/parse failure.
      } finally {
        setHydrated(true);
      }
    };
    load();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const toSave: PersistedSettings = { darkMode, fontScale, accent, goals, notifications };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [hydrated, darkMode, fontScale, accent, goals, notifications]);

  const setFontScale = (v: number) => setFontScaleState(Math.max(0.9, Math.min(1.2, v)));

  const value = useMemo<SettingsCtx>(
    () => ({
      darkMode,
      fontScale,
      accent,
      goals,
      notifications,
      hydrated,
      setDarkMode,
      setFontScale,
      setAccent,
      setGoals,
      setNotifications,
      resetSettings: () => {
        setDarkMode(defaultSettings.darkMode);
        setFontScaleState(defaultSettings.fontScale);
        setAccent(defaultSettings.accent);
        setGoals(defaultSettings.goals);
        setNotifications(defaultSettings.notifications);
      },
    }),
    [darkMode, fontScale, accent, goals, notifications, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error('SettingsContext missing');
  return v;
}
