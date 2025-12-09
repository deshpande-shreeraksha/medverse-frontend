// src/pages/BookAppointment.js
import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { getApiUrl } from "../api";
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
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Define a curated list of time slots
  const allTimeSlots = useMemo(() => {
    return [
      // Morning
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      // Afternoon
      "14:00", "14:30", "15:00", "15:30",
      // Evening
      "18:00", "18:30", "19:00", "19:30",
    ];
  }, []);

  // Filter out past time slots for today's date
  const availableTimeSlots = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    if (date === today) {
      return allTimeSlots.filter(slot => slot > currentTime);
    }
    return allTimeSlots;
  }, [date, allTimeSlots]);

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

  // Fetch booked time slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && date) {
      const fetchBookedSlots = async () => {
        setSlotsLoading(true);
        try {
          const res = await fetch(
            getApiUrl(`/api/appointments/booked-slots?doctorId=${selectedDoctor}&date=${date}`),
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setBookedSlots(data);
          }
        } catch (err) {
          console.error("Failed to fetch booked slots:", err);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchBookedSlots();
    }
  }, [selectedDoctor, date, token]);

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

    // --- Date and Time Validation ---
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5); // Format as "HH:MM"

    if (date < today) {
      setMessage("❌ Please select a future date for your appointment.");
      return;
    }
    if (date === today && time < currentTime) {
      setMessage("❌ Please select a future time for today's appointment.");
      return;
    }

    // --- Send request and wait for response ---
    setLoading(true);
    setMessage(""); // Clear any previous messages

    try {
      const doctor = doctorsData.find((d) => d.id.toString() === selectedDoctor);
      const res = await fetch(getApiUrl("/api/appointments"), {
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

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.message || data.errors?.[0]?.msg || "Booking failed. Please try again.";
        setMessage(`❌ ${errorMessage}`);
        setLoading(false);
        console.error("❌ Booking failed:", data);
      } else {
        const data = await res.json();
        setMessage("✅ Appointment booked successfully!");
        setLoading(false);
        console.log("📦 Booking response:", data);
        setTimeout(() => navigate("/dashboard"), 1500); // Redirect after success message is shown
      }
    } catch (err) {
      console.error("❌ Booking error:", err);
      setMessage("❌ A network error occurred. Please check your connection and try again.");
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
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Selection */}
            <div className="form-group">
              <label htmlFor="timeInput" className="form-label fw-bold">
                Select Time *
              </label>
              <select
                id="timeInput"
                className="form-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">-- Select a Time Slot --</option>
                                {availableTimeSlots.map(slot => (
                  <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                    {new Date(`1970-01-01T${slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {bookedSlots.includes(slot) ? " (Booked)" : ""}
                  </option>
                ))}

              </select>
              <small className="text-muted d-block mt-2">
                Appointments available in morning, afternoon, and evening slots.
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
