//goated ssala 
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Make sure you have Firebase config setup
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const EditAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Added for confirmation
        profilePic: null, // For file upload
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');

    // Fetch current user data from Firestore
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid); // Get the document reference
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setCurrentUser(userDoc.data());
                setFormData({
                    ...formData,
                    username: userDoc.data().displayName,
                    email: userDoc.data().email,
                });
            } else {
                console.error('No such document in Firestore!');
                setError('User data not found. Please check your account.');
            }
        } else {
            setError('No user is currently logged in.');
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] }); // Save the file object
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const user = auth.currentUser;

            if (!user) {
                setError('No user is currently logged in.');
                return;
            }

            // Reauthenticate user
            await signInWithEmailAndPassword(auth, user.email, formData.password);

            // Reference the document
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // Update user information in Firestore
                await updateDoc(userDocRef, {
                    displayName: formData.username,
                    email: formData.email,
                    profilePicture: formData.profilePic ? formData.profilePic.name : '',
                    latitude: '', // Assuming this will be updated later
                    longitude: '', // Assuming this will be updated later
                    role: 'Donator', // Set role as needed
                });
            } else {
                // Create a new user document if it doesn't exist
                await setDoc(userDocRef, {
                    displayName: formData.username,
                    email: formData.email,
                    profilePicture: formData.profilePic ? formData.profilePic.name : '',
                    latitude: '', // Assuming this will be updated later
                    longitude: '', // Assuming this will be updated later
                    role: 'Donator', // Set role as needed
                });
            }

            alert('Account updated successfully!');
        } catch (error) {
            console.error('Error updating account:', error);
            setError('Error updating account. Please check your password and try again.');
        }
    };

    // Handle account deletion
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            alert('Account deleted successfully');
            // Implement account deletion logic here
        }
    };

    return (
        <div className="edit-account-container" style={containerStyle}>
            <h2>Edit Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter new username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label htmlFor="profile-pic">Profile Picture:</label>
                <input
                    type="file"
                    id="profile-pic"
                    name="profilePic"
                    onChange={handleChange}
                    style={inputStyle}
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>Save Changes</button>
                <button type="button" className="delete-account" onClick={handleDelete} style={deleteButtonStyle}>
                    Delete Account
                </button>
            </form>
        </div>
    );
};

// Inline styles
const containerStyle = {
    width: '300px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    borderRadius: '10px',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
};

const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
};

export default EditAccount;
