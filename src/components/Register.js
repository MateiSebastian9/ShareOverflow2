import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Assume db is initialized Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState(''); // State for display name
    const [role, setRole] = useState('Donator'); // Default role is Donator
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store the user's information in Firestore with default values for profilePicture, latitude, and longitude
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: displayName, // Save display name
                profilePicture: '', // Default to empty string
                latitude: '', // Default to empty string
                longitude: '', // Default to empty string
                role: role,
            });

            alert("Account created successfully!");
        } catch (error) {
            console.error("Error during registration:", error); // Log the error for debugging
            setError("Error creating account. " + error.message); // Show specific error message
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Display Name:</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="Donator">Donator</option>
                            <option value="Receiver">Receiver</option>
                        </select>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
