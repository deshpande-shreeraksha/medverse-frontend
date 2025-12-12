import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const RoleDashboardRouter = () => {
  const { activeRole } = useContext(AuthContext);
  const location = useLocation();

  // The activeRole from context is the single source of truth.
  if (!activeRole) {
    // If for some reason role is not set, redirect to login to be safe.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  switch (activeRole) {
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
