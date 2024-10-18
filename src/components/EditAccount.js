import React, { useState } from 'react';

const EditAccount = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profilePic: null // For file upload
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] }); // Save the file object
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Account updated:', formData);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            alert('Account deleted successfully');
        }
    };

    return (
        <div className="edit-account-container" style={containerStyle}>
            <h2>Edit Account</h2>
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
