import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the function
import { useAuth } from '../AuthContext'; // Import the useAuth hook

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Access the login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Use the signInWithEmailAndPassword function
            await signInWithEmailAndPassword(auth, email, password);
            login(); // Update auth state after successful login
            navigate('/map'); // Redirect to map after successful login
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Donation App</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <div className="login-actions">
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                    <a href="/register" className="register-link">Register</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
