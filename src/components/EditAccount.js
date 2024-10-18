import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Ensure correct import
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore methods

const EditAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: null // For file upload
    });
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // Store the current user's data

    const auth = getAuth(); // Get the auth instance
    const db = getFirestore(); // Get the Firestore instance

    // Fetch the current user's data from Firestore (assumes user is logged in)
    const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setCurrentUser(userDoc.data());
                setFormData({
                    ...formData,
                    username: userDoc.data().displayName,
                    email: userDoc.data().email,
                });
            }
        }
    };

    // Call fetchUserData when the component mounts
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] }); // Save the file object
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // Check if the entered password is correct
            const user = auth.currentUser;
            await signInWithEmailAndPassword(auth, user.email, formData.password); // Reauthenticate user

            // Update user information in Firestore
            await updateDoc(doc(db, "users", user.uid), {
                displayName: formData.username,
                email: formData.email,
                profilePicture: formData.profilePic ? formData.profilePic.name : '',
                latitude: '', // Assuming this will be updated later
                longitude: '', // Assuming this will be updated later
                role: 'Donator', // Set role as needed
            });

            // If a profile picture is uploaded, handle that logic here (e.g., upload to Firebase Storage)

            alert("Account updated successfully!");
        } catch (error) {
            console.error("Error updating account:", error); // Log the error for debugging
            setError("Error updating account. Please check your password and try again.");
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            alert('Account deleted successfully');
            // Add your logic to delete the account from Firestore and Firebase Auth
        }
    };

    return (
        <div className="edit-account-container" style={containerStyle}>
            <h2>Edit Account</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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

                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                    type="password"
                    id="confirm-password"
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
