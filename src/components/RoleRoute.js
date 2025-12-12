import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// Usage: <RoleRoute allowedRoles={["admin"]}><AdminDashboard/></RoleRoute>
const RoleRoute = ({ allowedRoles = [], children, fallback = '/dashboard' }) => {
  const { user } = useContext(AuthContext);
  const role = (user && user.role) || (() => {
    try {
      const su = JSON.parse(localStorage.getItem('authUser') || '{}');
      return su.role;
    } catch {
      return null;
    }
  })();

  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles.length === 0 || allowedRoles.includes(role)) return children;
  return <Navigate to={fallback} replace />;
};

export default RoleRoute;
