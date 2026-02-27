import React, { createContext, useContext, useMemo, useState } from 'react';

export type Role = 'USER' | 'ADMIN';
export type User = { username: string; role: Role };

type AuthCtx = {
  user: User | null;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

const USERS = [
  { username: 'mm1', password: '1234', role: 'USER' as const },
  { username: 'admin', password: 'admin', role: 'ADMIN' as const },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthCtx>(() => ({
    user,
    signIn: (username, password) => {
      const u = USERS.find(
        x => x.username.toLowerCase() === username.toLowerCase() && x.password === password
      );
      if (!u) return false;
      setUser({ username: u.username, role: u.role });
      return true;
    },
    signOut: () => setUser(null),
  }), [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthContext missing');
  return v;
}