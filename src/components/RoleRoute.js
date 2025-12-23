import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// Usage: <RoleRoute allowedRoles={["admin"]}><AdminDashboard/></RoleRoute>
const RoleRoute = ({ allowedRoles = [], children, fallback = '/dashboard' }) => {
  const { user } = useContext(AuthContext);
  
  // Get user from context or localStorage
  const currentUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem('authUser') || '{}');
    } catch {
      return null;
    }
  })();

  if (!currentUser || !currentUser.role) return <Navigate to="/login" replace />;

  // Force admin role for support email
  let role = currentUser.role;
  if (currentUser.email === 'support@medverse.com') role = 'admin';

  if (allowedRoles.length === 0 || allowedRoles.includes(role)) return children;
  return <Navigate to={fallback} replace />;
};

export default RoleRoute;
