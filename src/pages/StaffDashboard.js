import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Staff Dashboard</h1>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Go to Site</button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Patient Check-in</h5>
            <p className="text-muted">Manage arrivals and front-desk tasks.</p>
            <button className="btn btn-primary btn-sm">Check-in</button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Billing</h5>
            <p className="text-muted">Access invoices and payments.</p>
            <button className="btn btn-primary btn-sm">Billing</button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Support Tickets</h5>
            <p className="text-muted">Manage patient or internal tickets.</p>
            <button className="btn btn-primary btn-sm">Tickets</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
