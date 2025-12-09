// src/pages/Login.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";
import { useNavigate, NavLink, useSearchParams, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get location to access state
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); setSuccessMessage("");

    try {
      const response = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data, rememberMe);
        setSuccessMessage(`✅ Welcome back, ${data.user.firstName}!`);
        // Redirect to the intended page or home page after a delay
        setTimeout(() => {
          if (redirectPath) {
            // Pass the preserved state during the final navigation
            navigate(decodeURIComponent(redirectPath), { state: location.state });
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (err) {
        // More helpful, actionable message when backend is unreachable
        const m = (err && err.message) ? err.message.toLowerCase() : '';
        if (m.includes('fetch') || m.includes('connect') || m.includes('network')) {
          setErrorMessage(`Unable to contact backend — is the server running? (${err.message})`);
        } else {
          setErrorMessage((err && err.message) ? `Server error: ${err.message}` : 'Server error');
        }
      }
  };

  return (
    <div className="card-container">
      <div className="card-box">
        <div className="card-header">Login</div>

        <form onSubmit={handleLogin}>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMeCheck"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="rememberMeCheck">
            Remember Me
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3 mb-3">
          Don’t have an account?{' '}
          <NavLink to="/signup" className="text-danger fw-bold">Sign Up</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
