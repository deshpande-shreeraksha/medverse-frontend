// src/pages/BookAppointment.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { doctorsData } from "../data/doctors";
import "../styles/bookappointment.css";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const { doctorId } = useParams(); // Read doctorId from URL parameter
  const location = useLocation(); // Read state from navigation

  // Use shared doctors data from data/doctors.js

  // Get initial values from URL params and location state
  const initialDoctorId = doctorId || "";
  
  // Find doctor from data to ensure we have the info even after a redirect
  const doctorFromData = doctorsData.find(d => d.id.toString() === initialDoctorId);

  // Prefer location.state, but fall back to looking up from data
  const initialDoctorName = location.state?.doctorName || doctorFromData?.name || "";
  const initialSpecialization = location.state?.specialization || doctorFromData?.specialization || "";

  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorId);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [mode, setMode] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Protect the route: redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      // Preserve the current path for redirection after login
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
        // Preserve the state to pass it back after login
        state: { from: location },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate, location]);

  // Get specialization of selected doctor by ID
  const getSelectedDoctorSpecialization = (doctorId) => {
    const doctor = doctorsData.find((d) => d.id.toString() === doctorId.toString());
    return doctor ? doctor.specialization : "";
  };

  // Handle doctor selection and auto-fill specialization
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    const spec = getSelectedDoctorSpecialization(doctorId);
    setSpecialization(spec || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Please login first");
      return;
    }

    if (!selectedDoctor || !mode || !date || !time) {
      setMessage("❌ Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const doctor = doctorsData.find((d) => d.id.toString() === selectedDoctor);
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          doctorName: doctor.name,
          specialization: specialization,
          mode,
          date,
          time,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + (data.message || "Appointment booked successfully!"));
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage("❌ " + (data.message || "Failed to book appointment"));
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Do not render the form if there's no token, to prevent a flicker before redirect
  if (!token) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="book-appointment-card">
        <div className="card-header-custom">
          <h2 className="mb-0">Book an Appointment</h2>
          <p className="mb-0 mt-2">Schedule a consultation with one of our experienced doctors</p>
        </div>

        <div className="card-body-custom">
          {message && (
            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Doctor Selection */}
            <div className="form-group">
              <label htmlFor="doctorSelect" className="form-label fw-bold">
                Select Doctor *
              </label>
              <select
                id="doctorSelect"
                className="form-select"
                value={selectedDoctor}
                onChange={handleDoctorChange}
                required
              >
                <option value="">-- Choose a Doctor --</option>
                {doctorsData.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization (Auto-filled) */}
            <div className="form-group">
              <label htmlFor="specialization" className="form-label fw-bold">
                Specialization
              </label>
              <input
                id="specialization"
                type="text"
                className="form-control"
                value={specialization}
                readOnly
                placeholder="Auto-filled based on selected doctor"
              />
            </div>

            {/* Mode of Appointment */}
            <div className="form-group">
              <label htmlFor="modeSelect" className="form-label fw-bold">
                Mode of Appointment *
              </label>
              <select
                id="modeSelect"
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                required
              >
                <option value="">-- Select Mode --</option>
                <option>In-Person</option>
                <option>Online Consultation</option>
              </select>
            </div>

            {/* Date Selection */}
            <div className="form-group">
              <label htmlFor="dateInput" className="form-label fw-bold">
                Select Date *
              </label>
              <input
                id="dateInput"
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Time Selection */}
            <div className="form-group">
              <label htmlFor="timeInput" className="form-label fw-bold">
                Select Time *
              </label>
              <input
                id="timeInput"
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                min="08:00"
                max="22:00"
              />
              <small className="text-muted d-block mt-2">
                Appointments available between 8:00 AM and 10:00 PM
              </small>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-confirm-appointment mt-4 w-100"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
