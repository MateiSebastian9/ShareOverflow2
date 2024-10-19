import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Assume db is initialized Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState(''); // State for display name
    const [role, setRole] = useState('Donator'); // Default role is Donator
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading
    const { login } = useAuth(); // Access the login function from context
    const navigate = useNavigate(); // Initialize useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true); // Start loading
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store the user's information in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: displayName, // Save display name
                profilePicture: '', // Default to empty string
                latitude: '', // Default to empty string
                longitude: '', // Default to empty string
                role: role,
            });

            login(); // Update auth state after successful registration
            alert("Account created successfully!");
            navigate('/dashboard'); // Redirect after successful registration
        } catch (error) {
            console.error("Error during registration:", error); // Log the error for debugging
            setError("Error creating account. " + error.message); // Show specific error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="register-container" style={styles.container}>
            <div className="register-box" style={styles.box}>
                <h1 style={styles.heading}>Register</h1>
                <form onSubmit={handleRegister}>
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
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Display Name:</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Role:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
                            <option value="Donator">Donator</option>
                            <option value="Receiver">Receiver</option>
                        </select>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button 
                        type="submit" 
                        style={{ ...styles.button, marginTop: '20px' }} 
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Registering..." : "Register"} {/* Loading indicator */}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        backgroundColor: '#d6e0e0',
    },
    
    box: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '350px',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    inputGroup: {
        marginBottom: '10px',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontSize: '16px',
        color: '#555',
        textAlign: 'center', // Center the label text
    },
    input: {
        width: '315px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    select: {
        width: '340px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        textAlign: 'center', // Center the text inside the select box
    },
    button: {
        width: '340px',
        padding: '10px',
        backgroundColor: '#6356e5',
        color: 'white',
        border: 'none',
        border: '2px solid black',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        opacity: 0.8, // Slightly dim the button to indicate loading
        boxSizing: 'border-box',
    },
};

export default Register;
