import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ adminToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
