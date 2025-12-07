// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  return token ? children : <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
