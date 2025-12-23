// src/pages/AuthCard.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AuthCard = () => {
  // Mark that the user has seen the auth gate so the site won't force /auth again
  useEffect(() => {
    try {
      localStorage.setItem('authSeen', '1');
    } catch {}
  }, []);
  
  // Redirect to the main login page instead of showing the card.
  // The login page has a link to the full signup page.
  return <Navigate to="/login" replace />;
};

export default AuthCard;
