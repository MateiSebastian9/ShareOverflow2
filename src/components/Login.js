// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the useAuth hook

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Access the login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password); // Call login function with email and password
            console.log("Login successful, redirecting...");
            navigate('/dashboard'); // Redirect to map after successful login
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div className="login-container" style={styles.container}>
            <div className="login-box" style={styles.box}>
                <h1 style={styles.heading}>Donation App</h1>
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <div className="login-actions" style={styles.actions}>
                    <a href="/forgot-password" className="forgot-password" style={styles.link}>Forgot Password?</a>
                    <a href="/register" className="register-link" style={styles.link}>Register</a>
                </div>
            </div>
        </div>
    );
};

// Inline styling consistent with previous version
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '94vh',  // Adjusted height
        backgroundColor: '#d6e0e0', // Updated background color
    },
    box: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '350px',  // Keep the width consistent
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '16px',
        color: '#555',
    },
    input: {
        width: '325px', // Set width to match previous styles
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    button: {
        width: '350px',
        padding: '10px',
        backgroundColor: '#6356e5', // Updated button color
        color: 'white',
        border: '2px solid black', // Updated border
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        opacity: 0.8, // Slightly dim the button
        boxSizing: 'border-box',
    },
    actions: {
        marginTop: '20px',
    },
    link: {
        display: 'block',
        color: '#6356e5', // Updated link color
        textDecoration: 'none',
        marginTop: '10px',
    },
};

export default Login;
