import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  });
  const [loading, setLoading] = useState(true);

  // Validate token structure or expiry on mount
  useEffect(() => {
    const validateSession = () => {
      const activeToken = token;
      if (activeToken) {
        try {
          // Parse JWT claims to check expiration date
          const payload = JSON.parse(atob(activeToken.split('.')[1]));
          const expiryTime = payload.exp * 1000;
          
          if (expiryTime < Date.now()) {
            logout();
          } else {
            setIsAuthenticated(true);
          }
        } catch (e) {
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    validateSession();
  }, [token]);

  const login = useCallback((authData, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('token', authData.token);
    storage.setItem('user', JSON.stringify(authData.admin));
    
    setToken(authData.token);
    setUser(authData.admin);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
