import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";
import { Form, Button, Card, Alert } from "react-bootstrap";

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
      const res = await fetch(getApiUrl("/api/users/change-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
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
        // No need to navigate, we are already in the dashboard
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
    <Card className="shadow-sm">
      <Card.Header as="h4">Change Password</Card.Header>
      <Card.Body>
        <p className="text-muted">Update your account password to keep it secure.</p>

          {message && (
            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formOldPassword">
              <Form.Label className="fw-bold">Current Password *</Form.Label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your current password"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label className="fw-bold">New Password *</Form.Label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your new password (min. 6 characters)"
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label className="fw-bold">Confirm Password *</Form.Label>
                <input
                  type={showPasswords ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your new password"
                />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formShowPassword">
              <Form.Check
                type="checkbox"
                label="Show passwords"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
            </Form.Group>

            <Alert variant="info">
              <strong>Password Requirements:</strong>
              <ul className="mb-0 mt-2">
                <li>At least 6 characters long</li>
                <li>Must be different from your current password</li>
                <li>Both new password fields must match</li>
              </ul>
            </Alert>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangePassword;
