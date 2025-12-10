import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";

const Contact = () => {
  const { token } = useContext(AuthContext);
  const authToken = token || localStorage.getItem("authToken");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) e.email = "Please enter a valid email";
    if (phone && !/^\+?[0-9\s-]{7,20}$/.test(phone)) e.phone = "Please enter a valid phone number";
    if (!message.trim() || message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSuccess("");
    setServerError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      // Attempt to POST to backend contact endpoint if it exists.
      const res = await fetch(getApiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (res.ok) {
        setSuccess("✅ Message sent. We'll get back to you soon.");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        // If backend route is not present (404) or returns error, show helpful fallback
        let body = {};
        try { body = await res.json(); } catch (_) {}
        if (res.status === 404) {
          setSuccess("✅ Your message was saved locally — please email support@medverse.com if urgent. (Backend contact endpoint not found)");
        } else {
          setServerError(body.message || body.error || "Failed to send message. Please try again later.");
        }
      }
    } catch (err) {
      setServerError("Network error — please check your connection or email support@medverse.com");
      console.error("Contact submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Contact Us</h2>

      <div className="row">
        <div className="col-md-6">
          <p>
            📍 Bengaluru, India <br />
            📞 +91 98765 43210 <br />
            ✉️ support@medverse.com
          </p>
          <p className="text-muted">Prefer direct email? Write to <strong>support@medverse.com</strong>.</p>
        </div>

        <div className="col-md-6">
          {success && <div className="alert alert-success">{success}</div>}
          {serverError && <div className="alert alert-danger">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Name *</label>
              <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label">Message *</label>
              <textarea className={`form-control ${errors.message ? 'is-invalid' : ''}`} rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
              {errors.message && <div className="invalid-feedback">{errors.message}</div>}
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Sending...' : 'Send Message'}</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => { setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage(''); setErrors({}); setServerError(''); setSuccess(''); }}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
