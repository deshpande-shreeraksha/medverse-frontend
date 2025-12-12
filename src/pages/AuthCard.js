// src/pages/AuthCard.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/authcard.css";

const AuthCard = () => {
  const [flipped, setFlipped] = useState(false);

  // 🔹 Add these states
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 🔹 Validation regex
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  // 🔹 Handle password input
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordRegex.test(value)) {
      setPasswordError("❌ Must be 8+ chars, include uppercase & special char");
    } else {
      setPasswordError("");
    }
  };

  // Mark that the user has seen the auth gate so the site won't force /auth again
  useEffect(() => {
    try {
      localStorage.setItem('authSeen', '1');
    } catch {}
  }, []);

  return (
    <div className="auth-container">
      <div className={`auth-card ${flipped ? "flipped" : ""}`}>
        
        {/* Front: Login */}
        <div className="auth-front">
          <h3 className="text-primary fw-bold mb-3 text-center">Login</h3>
          <form>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <p className="mt-3 text-center">
            Don’t have an account?{" "}
            <span className="flip-link text-danger fw-bold" onClick={() => setFlipped(true)}>
              Sign Up
            </span>
          </p>

          {/* Visible link to standalone Signup page so /auth users can switch to new flow */}
          <div className="text-center mt-2">
            <NavLink to="/signup" className="btn btn-outline-success btn-sm">
              Open full Sign Up page
            </NavLink>
          </div>
        </div>

        {/* Back: Signup */}
        <div className="auth-back">
          <h3 className="text-success fw-bold mb-3 text-center">Sign Up</h3>
          <form>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && (
                <small className="text-danger">{passwordError}</small>
              )}
            </div>
            <button type="submit" className="btn btn-success w-100">Sign Up</button>
          </form>
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <span className="flip-link text-primary fw-bold" onClick={() => setFlipped(false)}>
              Login
            </span>
          </p>

          <div className="text-center mt-2">
            <NavLink to="/signup" className="btn btn-outline-success btn-sm">
              Open full Sign Up page
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
