import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Admin Dashboard</h1>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Go to Site</button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Users</h5>
            <p className="text-muted">View, add, edit and deactivate patient and doctor accounts.</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/admin/users')}>Manage Users</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Appointments</h5>
            <p className="text-muted">Monitor, reschedule or cancel appointments.</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/admin/appointments')}>View Appointments</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Reports</h5>
            <p className="text-muted">Export KPIs and system reports (CSV / PDF).</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/admin/reports')}>Generate Report</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>Audit Log</h5>
            <p className="text-muted">View recent admin actions and exports.</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/admin/audits')}>View Audits</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
