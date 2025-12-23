import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const RoleDashboardRouter = () => {
  const { activeRole, user } = useContext(AuthContext);
  const location = useLocation();

  // Determine effective role
  let role = activeRole;

  // Fallback to localStorage if context is empty (page refresh)
  if (!role) {
    try {
      const stored = JSON.parse(localStorage.getItem('authUser') || '{}');
      role = stored.role;
      if (stored.email === 'support@medverse.com') role = 'admin';
    } catch {}
  }

  // Explicit override for support email
  if (user && user.email === 'support@medverse.com') role = 'admin';

  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  switch (role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" state={{ from: location }} replace />;
    case 'doctor':
      return <Navigate to="/dashboard/doctor" state={{ from: location }} replace />;
    case 'staff':
      return <Navigate to="/dashboard/staff" state={{ from: location }} replace />;
    case 'patient':
    default:
      return <Navigate to="/dashboard/patient" state={{ from: location }} replace />;
  }
};

export default RoleDashboardRouter;
