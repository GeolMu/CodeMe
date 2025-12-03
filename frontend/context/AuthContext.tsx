import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setUserState: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 토큰 확인 (쿠키/로컬스토리지)
    const token = apiClient.token;
    const storedUser = localStorage.getItem('codeme_user');

    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error('Failed to parse stored user:', err);
          localStorage.removeItem('codeme_user');
        }
      }

      // 토큰만 있을 때는 /me 호출로 사용자 정보 복원
      try {
        const u = await authService.me();
        setUser(u);
        localStorage.setItem('codeme_user', JSON.stringify(u));
      } catch (err) {
        console.error('Failed to fetch user from token:', err);
        apiClient.clearToken();
        localStorage.removeItem('codeme_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
    localStorage.setItem('codeme_user', JSON.stringify(u));
  };

  const signup = async (email: string, password: string, name: string) => {
    const u = await authService.signup(email, password, name);
    setUser(u);
    localStorage.setItem('codeme_user', JSON.stringify(u));
  };

  const loginWithGoogle = async () => {
    await authService.loginWithGoogle();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('codeme_user');
    // Clear any in-memory chat state via reload to ensure messages disappear immediately
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isLoading, setUserState: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
