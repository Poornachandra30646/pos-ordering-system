import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function generateFakeToken(user) {
  // Mock JWT structure for demo purposes
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ ...user, iat: Date.now() }));
  return `${header}.${payload}.`;
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
      if (stored) {
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

  const persistUser = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('pi_auth_user', JSON.stringify(userData));
    localStorage.setItem('pi_auth_token', generateFakeToken(userData));
  }, []);

  const login = useCallback((email, password) => {
    if (!email || !password) return false;
    // Mock login: accept any non-empty credentials
    const newUser = {
      name: email.split('@')[0],
      email,
      picture: null,
    };
    persistUser(newUser);
    return true;
  }, [persistUser]);

  const signup = useCallback((name, email, password) => {
    if (!name || !email || !password) return false;
    const newUser = {
      name,
      email,
      picture: null,
    };
    persistUser(newUser);
    return true;
  }, [persistUser]);

  const googleLogin = useCallback((credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const newUser = {
        name: decoded.name || decoded.given_name || 'User',
        email: decoded.email,
        picture: decoded.picture || null,
      };
      persistUser(newUser);
      return true;
    } catch (err) {
      console.error('Google login decode failed', err);
      return false;
    }
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pi_auth_user');
    localStorage.removeItem('pi_auth_token');
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

