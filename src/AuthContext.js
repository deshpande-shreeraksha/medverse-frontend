import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Prioritize localStorage (Remember Me) over sessionStorage
  const [token, setToken] = useState(localStorage.getItem("authToken") || sessionStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const login = (data, rememberMe = false) => {
    const userPayload = data.user || { 
      firstName: data.firstName, 
      lastName: data.lastName,
      email: data.email,
      id: data.id
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("authToken", data.token);
    storage.setItem("authUser", JSON.stringify(userPayload));

    setToken(data.token);
    setUser(userPayload);
  };

  const logout = () => {
    // Clear both storages to ensure a full logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");

    setToken(null);
    setUser(null);
    navigate("/login"); // Redirect to login after logout
  };

  // Direct setters for immediate context updates (used after signup/login)
  const updateToken = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const updateUser = (newUser) => {
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = { token, setToken: updateToken, user, setUser: updateUser, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};