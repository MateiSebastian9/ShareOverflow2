// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Ensure you import your Firebase auth
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true'; 
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            const newState = !!user; 
            if (newState !== isLoggedIn) {
                setIsLoggedIn(newState); 
                localStorage.setItem('isLoggedIn', newState); 
            }
        });

        return () => unsubscribe();
    }, [isLoggedIn]);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password); 
            setIsLoggedIn(true); 
            localStorage.setItem('isLoggedIn', 'true'); 
        } catch (error) {
            console.error("Login error: ", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            localStorage.setItem('isLoggedIn', 'false');
        } catch (error) {
            console.error("Logout error: ", error);
        }
    };

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
