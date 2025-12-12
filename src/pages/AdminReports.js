import React from 'react';
import AdminReportsForm from '../components/AdminReportsForm';

const AdminReports = () => {
  return (
    <div className="container my-4">
      <h2 className="h4 mb-3">Reports & Exports</h2>
      <p className="text-muted">Generate system reports, export KPIs, and download CSV/PDF files.</p>
      <AdminReportsForm />
    </div>
  );
};

export default AdminReports;
