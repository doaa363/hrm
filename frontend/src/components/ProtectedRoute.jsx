// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user info

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If user role is not authorized for this specific route
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated, render the child components
    return <Outlet />;
};

export default ProtectedRoute;