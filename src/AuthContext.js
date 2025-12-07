import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // initialize from localStorage so auth persists across reloads
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  let storedUser = null;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('authUser');
      storedUser = raw ? JSON.parse(raw) : null;
    } catch (e) {
      storedUser = null;
    }
  }

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
