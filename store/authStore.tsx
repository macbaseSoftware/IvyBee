// ─────────────────────────────────────────────────────────────────────────────
//  IvyLearner — Auth Store
//
//  In React Native, we can't use localStorage (that's browser-only).
//  Instead we use:
//    • AsyncStorage  — like localStorage but async, for non-sensitive data
//    • SecureStore   — encrypted storage (expo-secure-store) for JWT tokens
//
//  This file manages:
//    1. Saving/loading the JWT token from SecureStore
//    2. Storing the logged-in user object in React state
//    3. Providing login/logout functions
//
//  We use React Context so any screen in the app can read auth state.
// ─────────────────────────────────────────────────────────────────────────────
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const TOKEN_KEY = 'ivy_jwt_token';
const USER_KEY = 'ivy_user';

// SecureStore only works on native. On web we fall back to localStorage.
const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  async delete(key: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};

export interface AuthUser {
  id: number;
  email: string;
  role: 'student' | 'parent' | 'instructor' | 'admin';
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await storage.get(TOKEN_KEY);
        const storedUser = await storage.get(USER_KEY);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('Auth restore failed:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (newToken: string, newUser: AuthUser) => {
    await storage.set(TOKEN_KEY, newToken);
    await storage.set(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await storage.delete(TOKEN_KEY);
    await storage.delete(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
