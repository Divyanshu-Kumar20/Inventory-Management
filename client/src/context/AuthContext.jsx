import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('inventra_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Alex Vance',
      email: 'alex.vance@inventra.io',
      role: 'Super Admin',
      avatar: 'AV',
      isAuthenticated: true
    };
  });

  const login = (email, password) => {
    const newUser = {
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: 'Super Admin',
      avatar: email.substring(0, 2).toUpperCase(),
      isAuthenticated: true
    };
    setUser(newUser);
    localStorage.setItem('inventra_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventra_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
