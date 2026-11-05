import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { setAuthToken, SignedInUser } from '../services/api';

const TOKEN_KEY = 'ivybee_access_token';
const USER_KEY = 'ivybee_user';

const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string) {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  async delete(key: string) {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};

interface AuthContextValue {
  user: SignedInUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: SignedInUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SignedInUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([storage.get(TOKEN_KEY), storage.get(USER_KEY)]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (nextToken: string, nextUser: SignedInUser) => {
    await Promise.all([
      storage.set(TOKEN_KEY, nextToken),
      storage.set(USER_KEY, JSON.stringify(nextUser)),
    ]);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = async () => {
    await Promise.all([storage.delete(TOKEN_KEY), storage.delete(USER_KEY)]);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
