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
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Generate time slots based on doctor's availability
  const allTimeSlots = useMemo(() => {
    if (!date || doctorAvailability.length === 0) return [];

    const selectedDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = doctorAvailability.find(d => d.day === selectedDay);

    if (!daySchedule || !daySchedule.isAvailable) return [];

    const slots = [];
    let currentTime = new Date(`${date}T${daySchedule.startTime}`);
    const endTime = new Date(`${date}T${daySchedule.endTime}`);
    const slotDuration = 30; // in minutes

    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }
    return slots;

  }, [date, doctorAvailability]);

  // Filter out past time slots for today's date
  const availableTimeSlots = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    // Add a 5-minute buffer to the current time
    now.setMinutes(now.getMinutes() + 5);
    const currentTime = now.toTimeString().slice(0, 5);

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

  // Fetch doctor availability and booked slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && date) {
      const fetchScheduleData = async () => {
        setSlotsLoading(true);
        setBookedSlots([]);
        setDoctorAvailability([]);
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

          const availabilityRes = await fetch(getApiUrl(`/api/doctors/${selectedDoctor}/availability`));
          if (availabilityRes.ok) {
            const availabilityData = await availabilityRes.json();
            setDoctorAvailability(availabilityData);
          } else {
            setMessage("❌ Could not load doctor's availability.");
          }
        } catch (err) {
          console.error("Failed to fetch schedule data:", err);
        } finally {
          setSlotsLoading(false);
        }
      };
      fetchScheduleData();
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
                {slotsLoading ? (
                  <option disabled>Loading slots...</option>
                ) : availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map(slot => (
                    <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                      {new Date(`1970-01-01T${slot}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {bookedSlots.includes(slot) ? " (Booked)" : ""}
                    </option>
                  ))
                ) : (
                  <option disabled>No available slots for this day.</option>
                )}
              </select>
              {date && !slotsLoading && availableTimeSlots.length === 0 && (
                <small className="text-danger d-block mt-2">The doctor is not available on this day, or all slots are in the past.</small>
              )}
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
