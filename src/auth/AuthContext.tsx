import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { login as loginApi, type LoginResponse } from '../api/authApi';

interface AuthUser {
  name: string;
  role: string;
  tenant: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  forcePasswordChange: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  clearForcePasswordChange: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredAuth(): { token: string | null; user: AuthUser | null; forcePasswordChange: boolean } {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const fpc = localStorage.getItem('forcePasswordChange') === 'true';

  if (token && userJson) {
    try {
      return { token, user: JSON.parse(userJson), forcePasswordChange: fpc };
    } catch {
      localStorage.clear();
    }
  }
  return { token: null, user: null, forcePasswordChange: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadStoredAuth();
  const [token, setToken] = useState<string | null>(stored.token);
  const [user, setUser] = useState<AuthUser | null>(stored.user);
  const [forcePasswordChange, setForcePasswordChange] = useState(stored.forcePasswordChange);

  const login = useCallback(async (username: string, password: string) => {
    const data = await loginApi(username, password);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role, tenant: data.tenant }));
    localStorage.setItem('forcePasswordChange', String(data.forcePasswordChange));

    setToken(data.token);
    setUser({ name: data.name, role: data.role, tenant: data.tenant });
    setForcePasswordChange(data.forcePasswordChange);

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setForcePasswordChange(false);
  }, []);

  const clearForcePasswordChange = useCallback(() => {
    localStorage.setItem('forcePasswordChange', 'false');
    setForcePasswordChange(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, forcePasswordChange, login, logout, clearForcePasswordChange }),
    [token, user, forcePasswordChange, login, logout, clearForcePasswordChange],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
