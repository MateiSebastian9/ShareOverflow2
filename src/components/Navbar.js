// Navbar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if the navbar should be transparent based on the current route
    const isHomePage = location.pathname === '/home';
    const navbarStyle = {
        ...styles.navbar,
        backgroundColor: isHomePage ? 'transparent' : '#282c34', // Transparent for the home page only
    };

    return (
        <nav style={navbarStyle}>
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
        padding: '17.5px 35px',
        color: 'white', // Change navbar item color to white
        transition: 'background-color 0.3s', // Smooth transition for background change
    },
    title: {
        fontSize: '42px',
        cursor: 'pointer',
        color: 'white', // Change title font color to white
    },
    middleButtons: {
        display: 'flex',
        gap: '26.25px',
        marginLeft: '35px',
    },
};

// CSS for button styles
const buttonStyles = `
.button {
    padding: 14px 21px;
    border: 2px solid white; // Change border color to white
    border-radius: 8.75px;
    cursor: pointer;
    background-color: transparent;
    color: white; // Change button text color to white
    transition: background-color 0.3s, color 0.3s;
}

.button:hover {
    background-color: white; // Change background on hover to white
    color: black; // Change text color to black on hover
    border-color: black; // Change border color to black on hover
}
`;

// Inject CSS styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = buttonStyles;
document.head.appendChild(styleSheet);

export default Navbar;
