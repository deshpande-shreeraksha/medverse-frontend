import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "../styles/editprofile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, token, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    bloodType: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Prefer context token, fallback to localStorage
  const authToken = token || localStorage.getItem("authToken");

  // If no token, redirect to login (inside effect to respect hooks order)
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    if (!authToken) return; // wait until token exists
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setMessage(""); // don’t show error until we know it failed

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // IMPORTANT: include Bearer
        },
      });

      if (!res.ok) {
        // Try to parse server message, fallback to generic
        let errMsg = "❌ Failed to load profile";
        try {
          const errData = await res.json();
          if (errData?.message) errMsg = `❌ ${errData.message}`;
        } catch {}
        setMessage(errMsg);
        return;
      }

      const data = await res.json();

      // If your API returns user under data.user, adjust accordingly:
      const u = data.user || data;

      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        dateOfBirth: u.dateOfBirth || "",
        bloodType: u.bloodType || "",
      });

      // Optionally sync context/localStorage with fresh data
      setUser?.(u);
      localStorage.setItem("authUser", JSON.stringify(u));
    } catch (err) {
      console.error("Profile fetch error:", err);
      setMessage("❌ Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) return navigate("/login");

    setSaving(true);
    setMessage(""); // clear old messages

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.message
          ? `❌ ${data.message}`
          : "❌ Failed to update profile";
        setMessage(errMsg);
        return;
      }

      // If your API returns updated user as data.user
      const updatedUser = data.user || data;

      setMessage("✅ Profile updated successfully");
      setUser?.(updatedUser);
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      // Delay redirect so user can see success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("❌ Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  // Spinner while loading initial profile
  if (!authToken) {
    // Redirect handled above; render nothing to avoid flicker
    return null;
  }

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Fetching your profile...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="edit-profile-card">
        <div className="card-header-custom">
          <h2>Edit Profile</h2>
          <p>Update your personal information</p>
        </div>

        <div className="card-body-custom">
          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fw-bold">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fw-bold">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label fw-bold">Email Address *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label fw-bold">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label fw-bold">Blood Type</label>
              <select
                className="form-select"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">-- Select Blood Type --</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-save-profile flex-grow-1"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
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

export default EditProfile;
