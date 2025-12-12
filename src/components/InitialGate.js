import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

// InitialGate: if the user hasn't seen the auth gate yet and is not authenticated,
// redirect them to /auth. Otherwise render children.
const InitialGate = ({ children }) => {
  const { token } = useContext(AuthContext);

  // If user is authenticated, let them through
  if (token) return children;

  // If user has already seen the auth gate, render children (normal site)
  const seen = localStorage.getItem('authSeen');
  if (seen) return children;

  // Otherwise, send them to the auth selection page
  return <Navigate to="/auth" replace />;
};

export default InitialGate;
