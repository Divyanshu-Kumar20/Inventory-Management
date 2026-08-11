import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('inventra_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading user session:', e);
    }
    return null; // Default to unauthenticated state so app always starts on /login page
  });

  const login = (email, password, extraData = {}) => {
    const nameStr = extraData.name || email.split('@')[0].replace('.', ' ').toUpperCase();
    const newUser = {
      name: nameStr,
      email,
      role: extraData.role || 'Super Admin',
      avatar: nameStr.substring(0, 2).toUpperCase(),
      isAuthenticated: true,
      token: extraData.token || null
    };
    setUser(newUser);
    localStorage.setItem('inventra_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventra_user');
    localStorage.removeItem('inventra_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
