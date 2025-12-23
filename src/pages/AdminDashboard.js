import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminUserList from '../components/AdminUserList';
import AdminAppointmentsList from '../components/AdminAppointmentsList';
import AdminReportsForm from '../components/AdminReportsForm';
import AdminAuditList from '../components/AdminAuditList';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Admin Dashboard</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/')}>Go to Site</button>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`} 
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} 
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'audits' ? 'active' : ''}`} 
            onClick={() => setActiveTab('audits')}
          >
            Audit Logs
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'users' && <AdminUserList />}
        {activeTab === 'appointments' && <AdminAppointmentsList />}
        {activeTab === 'reports' && <AdminReportsForm />}
        {activeTab === 'audits' && <AdminAuditList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
