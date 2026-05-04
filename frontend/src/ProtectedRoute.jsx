import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from './api';

/**
 * ProtectedRoute component to guard routes that require authentication.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component to render if authenticated
 * @param {string} props.requiredRole - Role required to access the route ('admin' or 'voter')
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const isAuthenticated = authAPI.isAuthenticated();
  const currentUser = authAPI.getCurrentUser();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    // For admin routes, redirect to admin login, otherwise voter login
    const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser?.type !== requiredRole) {
    // Redirect to home if user doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
