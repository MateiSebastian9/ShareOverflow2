// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the custom hook

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth(); // Get auth state and functions
  const navigate = useNavigate(); // Hook for navigation

  return (
    <nav style={styles.navbar}>
      <div 
        style={styles.title} 
        onClick={() => navigate('/home')} 
        role="button" 
        tabIndex={0} 
        onKeyPress={(e) => e.key === 'Enter' && navigate('/home')}
      >
        ShareOverflow
      </div>
      <div style={styles.middleButtons}>
        {isLoggedIn ? (
          <>
            <button className="button" onClick={() => navigate('/home')}>Home</button>
            <button className="button" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="button" onClick={() => navigate('/map')}>Map</button>
            <button className="button" onClick={() => navigate('/profile')}>Profile</button>
            <button className="button" onClick={() => {
              logout(); // Handle logout action
              navigate('/login'); // Redirect to login page after logout
            }}>Logout</button>
          </>
        ) : (
          <>
            <button className="button" onClick={() => navigate('/login')}>Login</button>
            <button className="button" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

// Styles for the navbar
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    cursor: 'pointer', // Change cursor to pointer for better UX
  },
  middleButtons: {
    display: 'flex',
    gap: '15px', // Increased spacing between buttons
    marginLeft: '20px',
  },
};

// CSS for button styles
const buttonStyles = `
.button {
  padding: 8px 12px;
  border: 2px solid white;
  border-radius: 5px;
  cursor: pointer;
  background-color: transparent;
  color: white;
  transition: background-color 0.3s, color 0.3s;
}

.button:hover {
  background-color: white;
  color: black;
  border-color: black;
}
`;

// Inject CSS styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = buttonStyles;
document.head.appendChild(styleSheet);

export default Navbar;
