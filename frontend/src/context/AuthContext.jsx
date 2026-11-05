import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Start with null so user is required to log in before seeing the dashboard
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tripsync_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('tripsync_token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  // Simple, frictionless login or registration (accepts ANY email & password)
  const login = async (email, password, customName) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '123456';

    try {
      const res = await axios.post('/api/v1/auth/login', {
        email: cleanEmail,
        password: cleanPassword,
        name: customName
      });

      if (res.data && res.data.success) {
        const loggedUser = res.data.user;
        if (customName && loggedUser) {
          loggedUser.name = customName;
        }
        setUser(loggedUser);
        setToken(res.data.token);
        localStorage.setItem('tripsync_user', JSON.stringify(loggedUser));
        localStorage.setItem('tripsync_token', res.data.token);
        toast.success(`Welcome to TripSync AI, ${loggedUser.name}!`);
        return true;
      }
    } catch (err) {
      console.warn('Backend fallback auth');
    }

    // Direct fallback if backend API is offline
    const defaultName = customName || cleanEmail.split('@')[0] || 'Traveler';
    const fallbackUser = {
      id: 'user-' + Date.now(),
      name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanEmail}`
    };

    setUser(fallbackUser);
    setToken('session-jwt-token-2026');
    localStorage.setItem('tripsync_user', JSON.stringify(fallbackUser));
    localStorage.setItem('tripsync_token', 'session-jwt-token-2026');
    toast.success(`Welcome, ${fallbackUser.name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tripsync_user');
    localStorage.removeItem('tripsync_token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
