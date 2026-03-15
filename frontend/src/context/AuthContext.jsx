import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, {
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setStoredToken(data.token);
    setStoredUser(data.user);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    api.post('/auth/logout').catch(() => {});
  }, []);

  const signup = useCallback(async (fullName, email, password, role = 'employee') => {
    await api.post('/auth/register', { fullName, email, password, role });
    // Backend does not return token on register; user must login
    return null;
  }, []);

  const loadUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/profile');
      setStoredUser(data);
      setUser(data);
    } catch {
      clearAuthStorage();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
