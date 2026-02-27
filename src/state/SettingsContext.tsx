import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HealthGoals = {
  sleepHours: number;
  exerciseMinutes: number;
  maxPain: number;
  maxFatigue: number;
};

type SettingsCtx = {
  darkMode: boolean;
  fontScale: number;
  accent: string;
  goals: HealthGoals;
  hydrated: boolean;
  setDarkMode: (v: boolean) => void;
  setFontScale: (v: number) => void;
  setAccent: (v: string) => void;
  setGoals: (goals: HealthGoals) => void;
  resetSettings: () => void;
};

const Ctx = createContext<SettingsCtx | null>(null);
const STORAGE_KEY = 'medtracker_settings_v1';

type PersistedSettings = {
  darkMode: boolean;
  fontScale: number;
  accent: string;
  goals: HealthGoals;
};

const defaultGoals: HealthGoals = {
  sleepHours: 7,
  exerciseMinutes: 30,
  maxPain: 4,
  maxFatigue: 4,
};

const defaultSettings: PersistedSettings = {
  darkMode: false,
  fontScale: 1,
  accent: '#C4532E',
  goals: defaultGoals,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(defaultSettings.darkMode);
  const [fontScale, setFontScaleState] = useState(defaultSettings.fontScale);
  const [accent, setAccent] = useState(defaultSettings.accent);
  const [goals, setGoals] = useState<HealthGoals>(defaultSettings.goals);
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
    const toSave: PersistedSettings = { darkMode, fontScale, accent, goals };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [hydrated, darkMode, fontScale, accent, goals]);

  const setFontScale = (v: number) => setFontScaleState(Math.max(0.9, Math.min(1.2, v)));

  const value = useMemo<SettingsCtx>(
    () => ({
      darkMode,
      fontScale,
      accent,
      goals,
      hydrated,
      setDarkMode,
      setFontScale,
      setAccent,
      setGoals,
      resetSettings: () => {
        setDarkMode(defaultSettings.darkMode);
        setFontScaleState(defaultSettings.fontScale);
        setAccent(defaultSettings.accent);
        setGoals(defaultSettings.goals);
      },
    }),
    [darkMode, fontScale, accent, goals, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error('SettingsContext missing');
  return v;
}
