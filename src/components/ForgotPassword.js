import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            setError('Error sending reset email. Please check the email address.');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h1>Reset Password</h1>
                <form onSubmit={handleResetPassword}>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
