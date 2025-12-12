import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(localStorage.getItem("activeRole"));
  const navigate = useNavigate();

  useEffect(() => {
    // On initial load, parse user from storage if it exists
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Ensure activeRole is valid, otherwise default to the first role
      if (!parsedUser.roles || !parsedUser.roles.includes(activeRole)) {
        const defaultRole = parsedUser.roles ? parsedUser.roles[0] : 'patient';
        setActiveRole(defaultRole);
        localStorage.setItem("activeRole", defaultRole);
      }
    }
  }, [activeRole]);

  const login = (userData, authToken) => {
    // Make it robust: handle both user.role (string) and user.roles (array)
    const roles = userData.roles || (userData.role ? [userData.role] : ['patient']);
    const defaultRole = roles[0] || 'patient';

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("activeRole", defaultRole);
    setToken(authToken);
    setUser(userData);
    setActiveRole(defaultRole);
  };

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setActiveRole(null);
    navigate("/login");
  }, [navigate]);

  const switchRole = (newRole) => {
    if (user && user.roles.includes(newRole)) {
      localStorage.setItem("activeRole", newRole);
      setActiveRole(newRole);
      // Navigate to the correct dashboard when role is switched
      navigate(newRole === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient');
    }
  };

  const authContextValue = { token, user, activeRole, login, logout, switchRole };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};