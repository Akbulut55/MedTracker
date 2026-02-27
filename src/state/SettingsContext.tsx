import React, { createContext, useContext, useMemo, useState } from 'react';

type SettingsCtx = {
  darkMode: boolean;
  fontScale: number;   // 0.9 - 1.2
  accent: string;
  setDarkMode: (v: boolean) => void;
  setFontScale: (v: number) => void;
  setAccent: (v: string) => void;
};

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [fontScale, setFontScale] = useState(1.0);
  const [accent, setAccent] = useState('#C4532E');

  const value = useMemo<SettingsCtx>(() => ({
    darkMode,
    fontScale,
    accent,
    setDarkMode,
    setFontScale: (v) => setFontScale(Math.max(0.9, Math.min(1.2, v))),
    setAccent,
  }), [darkMode, fontScale, accent]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error('SettingsContext missing');
  return v;
}