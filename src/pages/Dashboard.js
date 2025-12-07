import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { Modal } from "react-bootstrap";
import MedicalRecords from "./MedicalRecords"; // Import the component
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showRecordsModal, setShowRecordsModal] = useState(false);

  // Always define hooks at the top
  const authToken = token || localStorage.getItem("authToken");

  // Redirect if not authenticated (inside useEffect, not before hooks)
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  // Use context user or parse from localStorage
  const displayUser =
    user ||
    (() => {
      try {
        return JSON.parse(localStorage.getItem("authUser") || "{}");
      } catch {
        return {};
      }
    })();

  // Fetch appointments and lab tests on mount
  useEffect(() => {
    if (!authToken) return; // safe condition inside hook
    fetchAppointments();
    fetchMedicalRecords();
    fetchLabTests();
  }, [authToken]);

  // Effect to combine and sort recent activity
  useEffect(() => {
    const combined = [
      ...medicalRecords.map(r => ({ ...r, type: 'record', activityDate: new Date(r.date) })),
      ...labTests.map(t => ({ ...t, type: 'test', activityDate: new Date(t.testDate) }))
    ];

    const sorted = combined
      .filter(item => !isNaN(item.activityDate.getTime())) // Filter out invalid dates
      .sort((a, b) => b.activityDate - a.activityDate);

    setRecentActivity(sorted.slice(0, 5)); // Show top 5 recent activities
  }, [medicalRecords, labTests]);




  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/medical-records", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMedicalRecords(data);
      }
    } catch (err) {
      console.error("Failed to fetch medical records:", err);
    }
  };

  const fetchLabTests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lab-tests", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLabTests(data);
      }
    } catch (err) {
      console.error("Failed to fetch lab tests:", err);
    }
  };

  const handleReschedule = (appointmentId) => {
    navigate(`/edit-appointment/${appointmentId}`);
  };

  // If no token, show nothing (redirect handled in useEffect)
  if (!authToken) {
    return null;
  }

  return (
    <div className="container my-5">
      {/* Welcome Header */}
      <div className="dashboard-header mb-5">
        <h1 className="display-5 fw-bold text-primary">
          Welcome back, {displayUser.firstName} 👋
        </h1>
        <p className="text-muted fs-5">
          Manage your appointments, health records, and medical history from one
          place.
        </p>
      </div>

      <div className="row">
        {/* Sidebar: User Profile Card */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <div
                className="avatar-placeholder bg-primary text-white rounded-circle mx-auto mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                }}
              >
                👤
              </div>
              <h5 className="card-title">
                {displayUser.firstName} {displayUser.lastName}
              </h5>
              <p className="text-muted small">
                {displayUser.email || "user@gmail.com"}
              </p>
              <hr />
              <button
                className="btn btn-outline-primary btn-sm w-100 mb-2"
                onClick={() => navigate("/edit-profile")}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h6 className="card-title fw-bold mb-3">Your Stats</h6>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Total Appointments</span>
                <span className="fw-bold text-primary">
                  {appointments.length}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Lab Tests</span>
                <span className="fw-bold text-success">{labTests.length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Medical Records</span>
                <span className="fw-bold text-info">{medicalRecords.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {/* Quick Actions */}
          <div className="row mb-5">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 text-center p-3 action-card">
                <div className="fs-2 mb-2">📅</div>
                <h6 className="fw-bold">Book Appointment</h6>
                <p className="text-muted small mb-3">
                  Schedule a visit with a doctor
                </p>
                <button
                  className="btn btn-primary btn-sm w-100"
                  onClick={() => navigate("/book-appointment")}
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 text-center p-3 action-card">
                <div className="fs-2 mb-2">📋</div>
                <h6 className="fw-bold">View Records</h6>
                <p className="text-muted small mb-3">
                  Access your medical records
                </p>
                <button
                  className="btn btn-primary btn-sm w-100"
                  onClick={() => setShowRecordsModal(true)}
                >
                  View
                </button>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 text-center p-3 action-card">
                <div className="fs-2 mb-2">🧪</div>
                <h6 className="fw-bold">Lab Tests</h6>
                <p className="text-muted small mb-3">
                  Check test results & reports
                </p>
                <button
                  className="btn btn-primary btn-sm w-100"
                  onClick={() => navigate("/lab-tests")}
                >
                  Check
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="mb-5">
            <h5 className="fw-bold mb-3">📅 Upcoming Appointments</h5>
            {loading ? (
              <div className="alert alert-info">Loading appointments...</div>
            ) : appointments.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover border">
                  <thead className="table-light">
                    <tr>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Date & Time</th>
                      <th>Mode</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt._id}>
                        <td className="fw-bold">{apt.doctorName}</td>
                        <td>{apt.specialization}</td>
                        <td>
                          {apt.date} at {apt.time}
                        </td>
                        <td>{apt.mode}</td>
                        <td>
                          <span
                            className={`badge ${
                              apt.status === "Confirmed"
                                ? "bg-success"
                                : apt.status === "Completed"
                                ? "bg-info"
                                : apt.status === "Cancelled"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td>
                          <button
  className="btn btn-sm btn-outline-primary"
  onClick={() => handleReschedule(apt._id)}
  disabled={
    apt.status === "Cancelled" ||
    apt.status === "Completed"
  }
>
  Reschedule
</button>


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                No appointments scheduled.{" "}
                <a href="/book-appointment">Book one now</a>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h5 className="fw-bold mb-3">📌 Recent Activity</h5>
            <div className="list-group">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity._id} className="list-group-item">
                    {activity.type === 'record' ? (
                      <>
                        <h6 className="mb-1">📄 Medical Record: {activity.title}</h6>
                        <p className="text-muted small mb-0">Type: {activity.recordType} - {activity.date}</p>
                      </>
                    ) : (
                      <>
                        <h6 className="mb-1">🧪 Lab Test: {activity.testName}</h6>
                        <p className="text-muted small mb-0">Status: {activity.status} - {activity.testDate}</p>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="list-group-item">
                  <p className="text-muted small">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical Records Modal */}
      <Modal
        show={showRecordsModal}
        onHide={() => setShowRecordsModal(false)}
        fullscreen={true}
        dialogClassName="records-modal"
      >
        <MedicalRecords isModal={true} onHide={() => setShowRecordsModal(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
