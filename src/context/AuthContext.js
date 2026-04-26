import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { registerUser, loginUser, googleLoginUser } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pi_auth_user');
      const token = localStorage.getItem('pi_auth_token');
      if (stored && token) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const persistUser = useCallback((token, userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('pi_auth_user', JSON.stringify(userData));
    localStorage.setItem('pi_auth_token', token);
  }, []);

  const login = useCallback(async (email, password) => {
    if (!email || !password) return false;
    try {
      const res = await loginUser({ email, password });
      persistUser(res.data.token, res.data.user);
      return true;
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      return false;
    }
  }, [persistUser]);

  const signup = useCallback(async (name, email, password) => {
    if (!name || !email || !password) return false;
    try {
      const res = await registerUser({ name, email, password });
      persistUser(res.data.token, res.data.user);
      return true;
    } catch (err) {
      console.error('Signup error:', err.response?.data?.message || err.message);
      return false;
    }
  }, [persistUser]);

  const googleLogin = useCallback(async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const payload = {
        name: decoded.name || decoded.given_name || 'User',
        email: decoded.email,
        picture: decoded.picture || null,
        googleId: decoded.sub || null,
      };
      const res = await googleLoginUser(payload);
      persistUser(res.data.token, res.data.user);
      return true;
    } catch (err) {
      console.error('Google login error:', err.response?.data?.message || err.message);
      return false;
    }
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pi_auth_user');
    localStorage.removeItem('pi_auth_token');
    localStorage.removeItem('pi_cart');
  }, []);

  const openAuthModal = useCallback((tab = 'login') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    authModalOpen,
    authTab,
    setAuthTab,
    login,
    signup,
    googleLogin,
    logout,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

