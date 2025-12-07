import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/authcard.css"; // or AuthCard.css if using flip-card

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Regex for validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordRegex.test(value)) {
      setPasswordError(
        "❌ Password must be at least 8 characters, include one uppercase letter and one special character"
      );
    } else {
      setPasswordError(""); // clear error if valid
      if (confirmPassword && confirmPassword !== value) setConfirmError("❌ Passwords do not match");
      else setConfirmError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (password && val !== password) setConfirmError("❌ Passwords do not match");
    else setConfirmError("");
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.trim();
    setEmail(val);
    // accept only gmail addresses (exact domain gmail.com)
    const gmailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!gmailRegex.test(val)) {
      setEmailError("❌ Please use a valid @gmail.com email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");

    // validate names
    let valid = true;
    if (!firstName.trim() || !lastName.trim()) {
      setNameError("❌ First name and last name are required");
      valid = false;
    } else {
      setNameError("");
    }

    // email validation
    if (!email) {
      setEmailError("❌ Email is required");
      valid = false;
    } else if (emailError) {
      // keep existing emailError message (gmail-only)
      valid = false;
    } else {
      setEmailError("");
    }

    // password validation
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "❌ Password must be at least 8 characters, include one uppercase letter and one special character"
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    // confirm password must match
    if (password !== confirmPassword) {
      setConfirmError("❌ Passwords do not match");
      valid = false;
    } else {
      setConfirmError("");
    }

    if (!valid) return;
    // continue signup logic - call backend
    (async () => {
      try {
        setServerError("");
        setIsSubmitting(true);
        const res = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          // save token and user and show inline success message
          localStorage.setItem("authToken", data.token);
          // backend returns names, persist them and set context
          const u = { firstName: data.firstName || firstName, lastName: data.lastName || lastName };
          localStorage.setItem('authUser', JSON.stringify(u));
          if (setToken) setToken(data.token);
          if (setUser) setUser(u);
          setSuccessMessage(data.message || "Signup successful. Redirecting...");
          // clear server/field errors
          setServerError("");
          setEmailError("");
          setNameError("");
          setPasswordError("");
          setConfirmError("");

          // auto-redirect after a short delay so user sees confirmation
          setTimeout(() => navigate("/"), 1400);
        } else {
          // map server message to field-level errors when possible, otherwise show general error
          const msg = data.message || data.error || "Signup failed";
          if (/gmail/.test(msg.toLowerCase())) setEmailError(msg);
          else if (/first name|last name/i.test(msg)) setNameError(msg);
          else if (/password/i.test(msg)) setPasswordError(msg);
          else if (/exists/i.test(msg)) setEmailError(msg);
          else setServerError(msg);
        }
      } catch (err) {
        console.error("Signup error:", err);
        // Detect a network/connectivity error and give actionable guidance
        const m = (err && err.message) ? err.message.toLowerCase() : '';
        if (m.includes('fetch') || m.includes('connect') || m.includes('network')) {
          setServerError(`Unable to contact backend at http://localhost:5000 — is the server running? (${err.message})`);
        } else {
          setServerError(`Server error while signing up${err && err.message ? ': ' + err.message : ''}`);
        }
      }
      finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="card-container">
      <div className="card-box">
        <div className="card-header">Sign Up</div>
        <form onSubmit={handleSubmit}>
        {serverError && (
          <div className="alert alert-danger" role="alert">{serverError}</div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">{successMessage}</div>
        )}
          <div className="row">
            <div className="mb-3 col-md-6">
              <label>First name</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                }}
                required
              />
              {nameError && !firstName.trim() && (
                <small className="text-danger">{nameError}</small>
              )}
            </div>

            <div className="mb-3 col-md-6">
              <label>Last name</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                }}
                required
              />
              {nameError && !lastName.trim() && (
                <small className="text-danger">{nameError}</small>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          {/* Password Field */}
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

        <div className="mb-3">
          <label>Confirm password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {confirmError && <small className="text-danger">{confirmError}</small>}
        </div>

        <div className="d-grid gap-2">
        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={
            isSubmitting ||
            !firstName.trim() ||
            !lastName.trim() ||
            !email ||
            !password ||
            !confirmPassword ||
            !!passwordError ||
            !!emailError ||
            !!nameError ||
            !!confirmError
          }
        >
          {isSubmitting ? "Signing up…" : "Sign Up"}
        </button>

        <div className="text-center mt-3">
          Already have an account?{' '}
          <NavLink to="/login" className="fw-bold text-primary">Login</NavLink>
        </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
