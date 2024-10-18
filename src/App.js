import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import Map from './components/Map';
import EditAccount from './components/EditAccount'; 
import Home from './components/Home';

function ProtectedRoute({ element: Component }) {
    const isAuthenticated = true;
    return isAuthenticated ? <Component /> : <Navigate to="/" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/map" element={<ProtectedRoute element={Map} />} />
                <Route path="/editaccount" element={<ProtectedRoute element={EditAccount} />} /> {/* Add the EditAccount route */}
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
