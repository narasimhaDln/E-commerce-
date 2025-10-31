import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        api.setToken(storedToken);
        const res = await api.get('/users/me');
        setUser(res.data);
        setToken(storedToken);
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        api.setToken('');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Force re-fetch user data when needed (after role changes)
  const refreshUser = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  function login(nextToken, nextUser) {
    setToken(nextToken);
    localStorage.setItem('token', nextToken);
    api.setToken(nextToken);
    setUser(nextUser);
  }

  function logout() {
    setToken('');
    localStorage.removeItem('token');
    api.setToken('');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, setUser, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
