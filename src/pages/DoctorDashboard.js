import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { Tabs, Tab, Button, Alert } from 'react-bootstrap';
import DoctorSchedule from './DoctorSchedule';
import DoctorAvailability from './DoctorAvailability';
import DoctorProfile from './DoctorProfile';
import ChangePassword from './ChangePassword';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [key, setKey] = useState('schedule');
  const [isRegistered, setIsRegistered] = useState(user?.isRegistered || false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.isRegistered) {
      setIsRegistered(true);
    }
  }, [user]);

  const handleRegister = async () => {
    if (isRegistered) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/doctor/register');
      setMessage('✅ ' + res.data.message);
      setIsRegistered(true);
      // Update stored auth user so UI that reads from storage sees the change
      try {
        const stored = localStorage.getItem('authUser');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.isRegistered = true;
          localStorage.setItem('authUser', JSON.stringify(parsed));
        }
      } catch (e) {
        console.warn('Could not update stored authUser', e);
      }

      // Redirect to public doctors listing so the doctor can see themselves
      navigate('/doctors');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setMessage('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Doctor Dashboard</h2>
        <div className="d-flex gap-3 align-items-center">
          <span className="badge bg-primary">Role: {user?.role}</span>
          {!isRegistered && (
            <Button 
              variant="success" 
              onClick={handleRegister} 
              disabled={loading}
              size="sm"
            >
              {loading ? 'Registering...' : 'Register Profile'}
            </Button>
          )}
          {isRegistered && (
            <span className="badge bg-success">✓ Registered & Visible</span>
          )}
        </div>
      </div>

      {message && (
        <Alert variant={message.includes('✅') ? 'success' : 'danger'} onClose={() => setMessage('')} dismissible>
          {message}
        </Alert>
      )}

      <Tabs
        id="doctor-dashboard-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
      >
        <Tab eventKey="schedule" title="Appointments">
          <div className="mt-3"><DoctorSchedule /></div>
        </Tab>
        <Tab eventKey="availability" title="Manage Availability">
          <div className="mt-3"><DoctorAvailability /></div>
        </Tab>
        <Tab eventKey="profile" title="Edit Profile">
          <div className="mt-3"><DoctorProfile /></div>
        </Tab>
        <Tab eventKey="security" title="Change Password">
          <div className="mt-3"><ChangePassword /></div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;