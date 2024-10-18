// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

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
                        <button className="button" onClick={() => navigate('/editaccount')}>Profile</button>
                        <button className="button" onClick={() => {
                            logout();
                            navigate('/login');
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

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '17.5px 35px', // Increased from 10px 20px to 17.5px 35px
        backgroundColor: '#282c34',
        color: 'white',
    },
    title: {
        fontSize: '42px', // Increased from 24px to 42px
        cursor: 'pointer',
    },
    middleButtons: {
        display: 'flex',
        gap: '26.25px', // Increased from 15px to 26.25px
        marginLeft: '35px', // Increased from 20px to 35px
    },
};

// CSS for button styles
const buttonStyles = `
.button {
    padding: 14px 21px; // Increased from 8px 12px to 14px 21px
    border: 2px solid white;
    border-radius: 8.75px; // Increased from 5px to 8.75px
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
