import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const requireContext = require.context('../media/iconoptions', false, /\.png$/);
const icons = requireContext.keys().map((fileName) => ({
    name: fileName.replace('./', '').replace('.png', ''),
    value: requireContext(fileName),
}));

const defaultIcon = require('../media/iconoptions/default.png');

const EditAccount = () => {
    const navigate = useNavigate(); // Use useNavigate hook
    const [formData, setFormData] = useState({
        username: '',
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
                const userData = userDoc.data();
                setCurrentUser(userData);
                const profilePicture = userData.profilePicture || defaultIcon;
                const profileIconPath = icons.find(icon => icon.name === profilePicture.split('.')[0])?.value || defaultIcon;

                setFormData(prevFormData => ({
                    ...prevFormData,
                    username: userData.displayName,
                    selectedIcon: profileIconPath,
                }));
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
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    const handleIconChange = (e) => {
        const selectedIconName = e.target.value;
        const selectedIcon = icons.find(icon => icon.name === selectedIconName)?.value || defaultIcon;
        setFormData(prevFormData => ({ ...prevFormData, selectedIcon }));
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

            await signInWithEmailAndPassword(auth, currentUser.email, formData.password);

            const userDocRef = doc(db, 'users', user.uid);
            const profilePictureFileName = formData.selectedIcon.split('/').pop();

            await updateDoc(userDocRef, {
                displayName: formData.username,
                profilePicture: profilePictureFileName,
                latitude: currentUser.latitude || "", // Keep the latitude value
                longitude: currentUser.longitude || "", // Keep the longitude value
                role: "Donator"
            });

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
                await auth.currentUser.delete();
                alert('Account deleted successfully');
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

    // Replace history.push with navigate
    const handleEditLocation = () => {
        navigate('/updatelocationuser'); // Use navigate here
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
                    value={formData.selectedIcon.split('/').pop()}
                    onChange={handleIconChange}
                    style={inputStyle}
                >
                    {icons.map((icon) => (
                        <option key={icon.name} value={icon.name}>
                            {icon.name}
                        </option>
                    ))}
                </select>

                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Latitude:</strong> {currentUser?.latitude || 'Not set'}</p>
                <p><strong>Longitude:</strong> {currentUser?.longitude || 'Not set'}</p>

                <button type="button" onClick={handleEditLocation} style={buttonStyle}>
                    Edit Location
                </button>

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
    zIndex: 1000,
};

const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
};

const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336',
};

export default EditAccount;
