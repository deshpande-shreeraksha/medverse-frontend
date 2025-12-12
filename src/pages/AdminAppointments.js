import React from 'react';
import AdminAppointmentsList from '../components/AdminAppointmentsList';

const AdminAppointments = () => {
  return (
    <div className="container my-4">
      <h2 className="h4 mb-3">Manage Appointments</h2>
      <p className="text-muted">This page shows appointments across the system with tools to cancel or page results.</p>
      <AdminAppointmentsList />
    </div>
  );
};

export default AdminAppointments;
