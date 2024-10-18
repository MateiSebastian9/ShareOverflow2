// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Ensure you import your Firebase auth

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  useEffect(() => {
    // Listener for authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsLoggedIn(!!user); // Update login state based on user existence
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
}, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
