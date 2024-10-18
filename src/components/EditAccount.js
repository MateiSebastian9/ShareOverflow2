import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const requireContext = require.context('../media/iconoptions', false, /\.png$/);
const icons = requireContext.keys().map((fileName) => ({
    name: fileName.replace('./', '').replace('.png', ''),
    value: requireContext(fileName),
}));

const defaultIcon = require('../media/iconoptions/default.png');

const EditAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedIcon: defaultIcon,
    });

    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setCurrentUser(userDoc.data());
                const profilePicture = userDoc.data().profilePicture || defaultIcon;
                setFormData({
                    ...formData,
                    username: userDoc.data().displayName,
                    email: userDoc.data().email,
                    selectedIcon: profilePicture,
                });
            } else {
                console.error('No such document in Firestore!');
                setError('User data not found. Please check your account.');
            }
        } else {
            setError('No user is currently logged in.');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleIconChange = (e) => {
        const selectedIconName = e.target.value; // Get only the icon name
        const selectedIcon = icons.find(icon => icon.name === selectedIconName)?.value || defaultIcon;
        setFormData({ ...formData, selectedIcon, selectedIconName }); // Store the icon name in state as well
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

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

            setLoading(true);
            await signInWithEmailAndPassword(auth, user.email, formData.password);

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            // Use only the file name for profilePicture (e.g., "iconName.png")
            const profilePictureFileName = formData.selectedIcon.split('/').pop(); // Get the icon file name

            if (userDoc.exists()) {
                await updateDoc(userDocRef, {
                    displayName: formData.username,
                    email: formData.email,
                    profilePicture: profilePictureFileName, // Store only the icon file name
                    latitude: "", // Update with desired latitude if available
                    longitude: "", // Update with desired longitude if available
                    role: "Donator" // Update or keep the role as needed
                });
            } else {
                await setDoc(userDocRef, {
                    displayName: formData.username,
                    email: formData.email,
                    profilePicture: profilePictureFileName, // Store only the icon file name
                    latitude: "", // Update with desired latitude if available
                    longitude: "", // Update with desired longitude if available
                    role: "Donator" // Update or keep the role as needed
                });
            }

            alert('Account updated successfully!');
        } catch (error) {
            console.error('Error updating account:', error);
            setError('Error updating account. Please check your password and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await auth.currentUser.delete(); // Delete user account from Firebase Auth
                alert('Account deleted successfully');
                // Optionally, redirect or update UI after deletion
            } else {
                setError('No user is currently logged in.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setError('Error deleting account. Please try again.');
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="edit-account-container" style={containerStyle}>
            <h2>Edit Account</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <img
                    src={formData.selectedIcon}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
            </div>

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

                <label htmlFor="icon">Profile Picture:</label>
                <select
                    id="icon"
                    name="icon"
                    value={formData.selectedIcon.split('/').pop()} // Use only the icon name for display
                    onChange={handleIconChange}
                    style={inputStyle}
                >
                    {icons.map((icon) => (
                        <option key={icon.name} value={icon.name}>
                            {icon.name}
                        </option>
                    ))}
                </select>

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

            {isDeleteModalOpen && (
                <div style={modalStyle}>
                    <h3>Are you sure you want to delete your account?</h3>
                    <button onClick={confirmDeleteAccount} style={confirmButtonStyle}>Yes, Delete</button>
                    <button onClick={() => setIsDeleteModalOpen(false)} style={cancelButtonStyle}>Cancel</button>
                </div>
            )}
        </div>
    );
};

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

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
};

const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
};

const cancelButtonStyle = {
    backgroundColor: '#ccc',
    color: 'black',
    border: 'none',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
};

export default EditAccount;
