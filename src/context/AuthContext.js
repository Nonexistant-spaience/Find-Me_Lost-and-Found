import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo account credentials
  const demoAccount = {
    email: 'demo@lostandfound.com',
    password: 'demo123',
    name: 'Demo User',
    id: 'demo-user-123'
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('lostAndFoundUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // Check demo account
        if (email === demoAccount.email && password === demoAccount.password) {
          const user = {
            id: demoAccount.id,
            email: demoAccount.email,
            name: demoAccount.name,
            isDemo: true
          };
          setCurrentUser(user);
          localStorage.setItem('lostAndFoundUser', JSON.stringify(user));
          resolve(user);
        } else {
          // For demo purposes, accept any email/password combination
          // In a real app, you would validate against a backend
          const user = {
            id: `user-${Date.now()}`,
            email: email,
            name: email.split('@')[0],
            isDemo: false
          };
          setCurrentUser(user);
          localStorage.setItem('lostAndFoundUser', JSON.stringify(user));
          resolve(user);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lostAndFoundUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    demoAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
