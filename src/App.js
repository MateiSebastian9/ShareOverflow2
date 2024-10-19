import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import EditAccount from './components/EditAccount'; 
import Home from './components/Home';
import Navbar from './components/Navbar';
import Map from './components/Map';
import DashboardDonor from './components/DashboardDonor';
import UpdateLocation from './components/UpdateLocation'; 

function ProtectedRoute({ element: Component }) {
    const { isLoggedIn } = useAuth(); // Use useAuth to check authentication state
    return isLoggedIn ? <Component /> : <Navigate to="/" />; // Redirect if not authenticated
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={styles.container}> {/* Add a container for flex layout */}
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/map" element={<ProtectedRoute element={Map} />} />
                        <Route path="/dashboard" element={<ProtectedRoute element={DashboardDonor} />} />
                        <Route path="/updatelocation" element={<ProtectedRoute component={UpdateLocation} />} /> {/* Add the UpdateLocation route */}
                        <Route path="/editaccount" element={<ProtectedRoute element={EditAccount} />} /> {/* Add the EditAccount route */}
                        <Route path="*" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

// Styles for the main App component
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Ensure the container uses full viewport height
        overflow: 'hidden', // Prevent overflow
    },
};

export default App;
