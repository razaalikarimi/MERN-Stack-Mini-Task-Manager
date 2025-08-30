import React, { createContext, useState, useEffect } from 'react';
import { request } from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('tm_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tm_token') || null);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('tm_token', token);
      localStorage.setItem('tm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tm_token');
      localStorage.removeItem('tm_user');
    }
  }, [token, user]);

  const login = async (email, password) => {
    const res = await request('/auth/login', 'POST', { email, password });
    setUser(res.user); setToken(res.token);
    return res;
  };
  const register = async (name, email, password) => {
    const res = await request('/auth/register', 'POST', { name, email, password });
    setUser(res.user); setToken(res.token);
    return res;
  };
  const logout = () => { setUser(null); setToken(null); };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
}

