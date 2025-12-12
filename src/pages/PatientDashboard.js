import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">My Dashboard</h1>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Go to Site</button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Appointments</h5>
            <p className="text-muted">View, reschedule or cancel appointments.</p>
            <button className="btn btn-primary btn-sm">My Appointments</button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Medical Records</h5>
            <p className="text-muted">Access reports, upload documents securely.</p>
            <button className="btn btn-primary btn-sm">View Records</button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Support</h5>
            <p className="text-muted">Open tickets and provide feedback.</p>
            <button className="btn btn-primary btn-sm">Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
