import React from 'react';

const AuthErrorBanner = ({ message }) => {
  if (!message) return null;
  const isAuth = String(message).startsWith('401') || String(message).toLowerCase().includes('no token');
  if (!isAuth) return null;

  return (
    <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
      <div>
        <strong>Session expired or not authenticated.</strong>
        <div className="small">Please sign in again to continue using admin pages.</div>
      </div>
      <div>
        <a href="/login" className="btn btn-sm btn-primary">Go to Login</a>
      </div>
    </div>
  );
};

export default AuthErrorBanner;
