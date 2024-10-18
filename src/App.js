import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import Map from './components/Map';
import EditAccount from './components/EditAccount'; 
import Home from './components/Home';
import Navbar from './components/Navbar';

function ProtectedRoute({ element: Component }) {
    const { isLoggedIn } = useAuth(); // Use useAuth to check authentication state
    return isLoggedIn ? <Component /> : <Navigate to="/" />; // Redirect if not authenticated
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/map" element={<ProtectedRoute element={Map} />} />
                    <Route path="/editaccount" element={<ProtectedRoute element={EditAccount} />} /> {/* Add the EditAccount route */}
                    <Route path="*" element={<Login />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
