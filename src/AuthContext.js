import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Ensure you import your Firebase auth

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Initialize state from local storage
        return localStorage.getItem('isLoggedIn') === 'true'; 
    });

    useEffect(() => {
        // Listener for authentication state
        const unsubscribe = auth.onAuthStateChanged((user) => {
            const newState = !!user; // Update login state based on user existence
            if (newState !== isLoggedIn) {
                setIsLoggedIn(newState); // Update state
                localStorage.setItem('isLoggedIn', newState); // Store new state in local storage
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
