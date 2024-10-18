// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <nav style={styles.navbar}>
      <div style={styles.title}>ShareOverflow</div>
      <div style={styles.middleButtons}>
        <button style={styles.middleButton} onClick={() => navigate('/home')}>Home</button>
        <button style={styles.middleButton} onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button style={styles.middleButton} onClick={() => navigate('/map')}>Map</button>
      </div>
      <div style={styles.buttons}>
        <button style={styles.button} onClick={() => navigate('/login')}>Login</button>
        <button style={styles.button} onClick={() => navigate('/register')}>Register</button>
      </div>
    </nav>
  );
};

// Styles remain the same with adjustments
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
  },
  middleButtons: {
    display: 'flex',
    gap: '10px',
    marginLeft: '20px', // Adjust this value to bring buttons closer to the title
  },
  middleButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#61dafb',
    color: 'black',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#61dafb',
    color: 'black',
  },
};

export default Navbar;
