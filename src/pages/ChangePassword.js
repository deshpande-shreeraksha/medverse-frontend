import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "../styles/changepassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const authToken = token || localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("❌ New passwords don't match");
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setMessage("❌ New password must be at least 6 characters");
      return;
    }

    // Validate old password is different
    if (formData.oldPassword === formData.newPassword) {
      setMessage("❌ New password must be different from old password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password changed successfully");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setMessage("❌ " + (data.message || "Failed to change password"));
      }
    } catch (err) {
      setMessage("❌ Error changing password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="change-password-card">
        <div className="card-header-custom">
          <h2>Change Password</h2>
          <p>Update your account password to keep it secure</p>
        </div>

        <div className="card-body-custom">
          {message && (
            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label fw-bold">Current Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your current password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label fw-bold">New Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your new password (min. 6 characters)"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label fw-bold">Confirm Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your new password"
                />
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="showPassword"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="showPassword">
                Show passwords
              </label>
            </div>

            <div className="alert alert-info" role="alert">
              <strong>Password Requirements:</strong>
              <ul className="mb-0 mt-2">
                <li>At least 6 characters long</li>
                <li>Must be different from your current password</li>
                <li>Both new password fields must match</li>
              </ul>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-change-password flex-grow-1"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
