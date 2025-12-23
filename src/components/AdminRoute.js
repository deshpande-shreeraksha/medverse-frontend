import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Retrieve user from context or localStorage to handle page refreshes
  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  })();

  // 1. Not authenticated -> Redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Not authorized (Not an Admin) -> Redirect to standard Dashboard
  if (currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Authorized -> Render children
  return children;
};

export default AdminRoute;